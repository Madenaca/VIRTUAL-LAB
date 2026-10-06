"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useLabAuth } from "@/lib/useLabAuth";
import { soalKuis } from "@/lib/soal-kuis";
import { Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw } from "lucide-react";

const WAKTU_TOTAL = 15 * 60; // 15 menit

const kategoriLabel: Record<string, string> = {
  alat: "🔬 Alat Lab",
  keselamatan: "🛡️ Keselamatan",
  simbol: "⚠️ Simbol",
  prosedur: "📋 Prosedur",
};

export default function KuisPage() {
  const router = useRouter();
  const { isAuthorized, isChecking } = useLabAuth();
  const { setSkor, setJawabanKuis } = useAppStore();

  const [currentSoal, setCurrentSoal] = useState(0);
  const [jawaban, setJawaban] = useState<(number | null)[]>(Array(soalKuis.length).fill(null));
  const [selesai, setSelesai] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [waktu, setWaktu] = useState(WAKTU_TOTAL);
  const [started, setStarted] = useState(false);

  const hitungSkor = useCallback(() => {
    const benar = jawaban.filter((j, i) => j === soalKuis[i].kunci).length;
    const persen = Math.round((benar / soalKuis.length) * 100);
    setSkor(persen);
    setJawabanKuis(
      jawaban.map((j, i) => ({
        soalId: soalKuis[i].id,
        pilihan: j ?? -1,
        benar: j === soalKuis[i].kunci,
      }))
    );
    return { benar, persen };
  }, [jawaban, setSkor, setJawabanKuis]);

  // Timer
  useEffect(() => {
    if (!started || selesai) return;
    const interval = setInterval(() => {
      setWaktu((t) => {
        if (t <= 1) {
          setSelesai(true);
          hitungSkor();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, selesai, hitungSkor]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 text-sm font-medium">Memverifikasi akses laboratorium...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <p className="text-slate-700 font-medium">Kamu belum login ke laboratorium.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Masuk sebagai Siswa
            </button>
            <button
              onClick={() => router.push("/admin/login")}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Portal Guru / Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatWaktu = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handlePilih = (idx: number) => {
    if (selesai) return;
    const next = [...jawaban];
    next[currentSoal] = idx;
    setJawaban(next);
  };

  const handleSelesai = () => {
    hitungSkor();
    setSelesai(true);
  };

  const soal = soalKuis[currentSoal];
  const benarCount = jawaban.filter((j, i) => j === soalKuis[i].kunci).length;
  const skor = Math.round((benarCount / soalKuis.length) * 100);
  const dijawab = jawaban.filter((j) => j !== null).length;

  const getGrade = (persen: number) => {
    if (persen >= 90) return { label: "Sangat Baik! 🏆", color: "text-yellow-600", bg: "from-yellow-400 to-amber-500" };
    if (persen >= 75) return { label: "Baik! 🌟", color: "text-blue-600", bg: "from-blue-400 to-blue-600" };
    if (persen >= 60) return { label: "Cukup 👍", color: "text-green-600", bg: "from-green-400 to-green-600" };
    return { label: "Perlu Belajar Lagi 📚", color: "text-slate-600", bg: "from-slate-400 to-slate-600" };
  };

  if (!started) {
    return (
      <div className="min-h-screen lab-pattern flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-white/50"
        >
          <div className="text-6xl">📝</div>
          <h1 className="text-2xl font-extrabold text-slate-800">Kuis Evaluasi</h1>
          <p className="text-slate-600 text-sm">Uji pemahaman kamu tentang alat dan keselamatan laboratorium!</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: "Soal", val: "15" },
              { label: "Waktu", val: "15 Mnt" },
              { label: "Nilai KKM", val: "75" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-100 rounded-xl py-3">
                <p className="font-extrabold text-2xl text-blue-700">{s.val}</p>
                <p className="text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
            <p className="text-xs text-amber-700 font-semibold">📌 Petunjuk:</p>
            <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
              <li>Pilih satu jawaban yang paling tepat</li>
              <li>Kerjakan semua soal sebelum waktu habis</li>
              <li>Kamu bisa kembali ke soal sebelumnya</li>
            </ul>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-lg"
          >
            Mulai Kuis 🚀
          </button>
        </motion.div>
      </div>
    );
  }

  if (selesai) {
    const grade = getGrade(skor);
    return (
      <div className="min-h-screen lab-pattern pb-20 pt-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Result card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl shadow-2xl p-8 text-center border border-white/50 space-y-4"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-extrabold text-slate-800">Hasil Kuis</h2>
            <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br ${grade.bg} shadow-2xl`}>
              <div className="text-white text-center">
                <p className="text-5xl font-extrabold">{skor}</p>
                <p className="text-sm opacity-80">dari 100</p>
              </div>
            </div>
            <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-green-50 rounded-xl py-3 border border-green-200">
                <p className="font-extrabold text-2xl text-green-600">{benarCount}</p>
                <p className="text-green-700 text-xs">Benar</p>
              </div>
              <div className="bg-red-50 rounded-xl py-3 border border-red-200">
                <p className="font-extrabold text-2xl text-red-600">{soalKuis.length - benarCount}</p>
                <p className="text-red-700 text-xs">Salah</p>
              </div>
              <div className="bg-blue-50 rounded-xl py-3 border border-blue-200">
                <p className="font-extrabold text-2xl text-blue-600">{soalKuis.length}</p>
                <p className="text-blue-700 text-xs">Total Soal</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                {showReview ? "Sembunyikan" : "📋 Lihat Pembahasan"}
              </button>
              <button
                onClick={() => router.push("/refleksi")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all"
              >
                Lanjut ke Refleksi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => { setSelesai(false); setJawaban(Array(soalKuis.length).fill(null)); setCurrentSoal(0); setWaktu(WAKTU_TOTAL); setShowReview(false); }}
              className="flex items-center gap-2 mx-auto text-slate-500 text-sm hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Kuis
            </button>
          </motion.div>

          {/* Review */}
          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {soalKuis.map((s, i) => {
                  const userAns = jawaban[i];
                  const isBenar = userAns === s.kunci;
                  return (
                    <div
                      key={s.id}
                      className={`bg-white rounded-2xl p-5 border-2 shadow ${isBenar ? "border-green-300" : "border-red-300"}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {isBenar ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex gap-2 mb-1">
                            <span className="text-xs bg-slate-100 rounded px-2 py-0.5 font-mono text-slate-500">#{i + 1}</span>
                            <span className="text-xs bg-blue-100 rounded px-2 py-0.5 text-blue-700">{kategoriLabel[s.kategori]}</span>
                          </div>
                          <p className="font-semibold text-slate-800 text-sm">{s.soal}</p>
                        </div>
                      </div>
                      <div className="space-y-2 ml-8">
                        {s.opsi.map((opsi, j) => (
                          <div
                            key={j}
                            className={`px-3 py-2 rounded-xl text-sm border ${
                              j === s.kunci
                                ? "bg-green-100 border-green-400 text-green-800 font-semibold"
                                : j === userAns && !isBenar
                                ? "bg-red-100 border-red-400 text-red-800"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + j)}. {opsi}
                          </div>
                        ))}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mt-2">
                          <p className="text-xs text-blue-700">
                            <span className="font-bold">💡 Penjelasan: </span>{s.penjelasan}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lab-pattern pb-20 pt-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 shadow border border-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span>Soal {currentSoal + 1}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400">{soalKuis.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-mono font-bold ${waktu < 120 ? "text-red-500" : "text-slate-700"}`}>
            <Clock className="w-4 h-4" />
            {formatWaktu(waktu)}
          </div>
          <div className="text-xs text-slate-500">{dijawab}/{soalKuis.length} dijawab</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            animate={{ width: `${((currentSoal + 1) / soalKuis.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Soal card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSoal}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass rounded-3xl shadow-xl p-7 border border-white/50 space-y-5"
          >
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-semibold">
                {kategoriLabel[soal.kategori]}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-relaxed">{soal.soal}</p>
            <div className="space-y-3">
              {soal.opsi.map((opsi, i) => (
                <button
                  key={i}
                  onClick={() => handlePilih(i)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-sm transition-all hover:scale-[1.01] ${
                    jawaban[currentSoal] === i
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opsi}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSoal((s) => Math.max(0, s - 1))}
            disabled={currentSoal === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Sebelumnya
          </button>

          {/* Soal navigator dots */}
          <div className="flex-1 flex justify-center gap-1 overflow-x-auto py-1">
            {soalKuis.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSoal(i)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  i === currentSoal
                    ? "bg-blue-600 text-white"
                    : jawaban[i] !== null
                    ? "bg-green-200 text-green-800"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentSoal < soalKuis.length - 1 ? (
            <button
              onClick={() => setCurrentSoal((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Berikutnya <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSelesai}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all shadow"
            >
              Selesai ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
