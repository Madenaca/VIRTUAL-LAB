"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useClickSound } from "@/lib/useSound";
import {
  Play, ArrowRight, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Lightbulb, ClipboardList,
} from "lucide-react";

/* ─── Konten sesuai video: "Keselamatan Kerja di Laboratorium" ─── */
const simulasi = {
  youtubeId: "BbE__JY1BfE",
  title: "Keselamatan Kerja di Laboratorium Kimia",
  subtitle: "Studi Kasus: Pelanggaran Prosedur Keselamatan Lab",
  kasusDesc:
    "Video ini menampilkan berbagai pelanggaran prosedur keselamatan yang sering terjadi di laboratorium kimia, seperti tidak memakai APD lengkap, cara menghisap pipet yang salah, penanganan bahan kimia tanpa membaca label, serta penggunaan alat yang tidak benar. Perhatikan setiap kesalahan yang ditunjukkan, kemudian jawab pertanyaan analisis dan isi lembar kerja berikut!",

  pertanyaan: [
    "Sebutkan minimal 3 (tiga) kesalahan prosedur keselamatan yang kamu temukan dalam video tersebut!",
    "Mengapa penggunaan APD (Alat Pelindung Diri) seperti jas lab, kacamata, dan sarung tangan sangat wajib saat bekerja di laboratorium?",
    "Apa risiko/dampak yang dapat terjadi jika seseorang menghisap larutan kimia menggunakan mulut tanpa propipet?",
    "Bagaimana cara yang benar untuk mencium bau suatu bahan kimia agar tidak membahayakan diri sendiri?",
    "Jika terjadi tumpahan bahan kimia korosif di kulit, apa langkah pertolongan pertama yang harus segera dilakukan?",
  ],

  pblSteps: [
    {
      step: 1,
      label: "Orientasi Masalah",
      desc: "Baca deskripsi kasus di atas, lalu tonton video dengan seksama.",
      color: "bg-blue-100 border-blue-300 text-blue-700",
    },
    {
      step: 2,
      label: "Analisis Video",
      desc: "Identifikasi kesalahan yang terjadi dengan menjawab pertanyaan pemandu.",
      color: "bg-orange-100 border-orange-300 text-orange-700",
    },
    {
      step: 3,
      label: "Lembar Kerja",
      desc: "Isi lembar kerja digital: penyebab, dampak, dan solusi.",
      color: "bg-purple-100 border-purple-300 text-purple-700",
    },
    {
      step: 4,
      label: "Rumuskan Solusi",
      desc: "Simpulkan prosedur yang benar dan cara pencegahan.",
      color: "bg-green-100 border-green-300 text-green-700",
    },
  ],
};

const lembarKerjaFields = [
  {
    key: "penyebab",
    label: "🔍 Identifikasi Penyebab Masalah",
    placeholder:
      "Tuliskan penyebab utama kecelakaan/pelanggaran yang terjadi dalam video. Contoh: siswa tidak memakai jas lab saat bekerja dengan bahan kimia berbahaya...",
  },
  {
    key: "dampak",
    label: "⚠️ Dampak yang Ditimbulkan",
    placeholder:
      "Tuliskan dampak nyata dan potensi bahaya dari kesalahan tersebut. Contoh: percikan bahan kimia dapat mengenai kulit dan menyebabkan luka bakar kimia...",
  },
  {
    key: "solusi",
    label: "💡 Solusi & Prosedur yang Benar",
    placeholder:
      "Tuliskan prosedur keselamatan yang benar yang seharusnya dilakukan. Contoh: sebelum memulai praktikum, pastikan semua APD terpasang dengan benar...",
  },
  {
    key: "pencegahan",
    label: "🛡️ Langkah Pencegahan ke Depan",
    placeholder:
      "Tuliskan langkah konkret untuk mencegah kejadian serupa di masa mendatang. Contoh: membuat daftar periksa APD sebelum masuk lab dan ditandatangani guru...",
  },
];

export default function SimulasiPage() {
  const router = useRouter();
  const { sudahLogin, setLembarKerja: saveToStore, lembarKerja: storeLK } = useAppStore();
  const playClick = useClickSound();

  const [showQuestions, setShowQuestions] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [lembarKerja, setLembarKerja] = useState<Record<string, string>>({
    penyebab: storeLK?.penyebab || "",
    dampak: storeLK?.dampak || "",
    solusi: storeLK?.solusi || "",
    pencegahan: storeLK?.pencegahan || "",
  });
  const [saved, setSaved] = useState(false);

  if (!sudahLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button
          onClick={() => { playClick(); router.push("/"); }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  const handleLembarKerja = (field: string, value: string) => {
    setLembarKerja((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    playClick();
    saveToStore(lembarKerja as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen lab-pattern pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Play className="w-4 h-4" /> Halaman 3 dari 6 · Problem-Based Learning
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800">
            Simulasi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Keselamatan Kerja
            </span>{" "}
            Laboratorium
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
            Tonton video, identifikasi kesalahan, dan rumuskan solusi keselamatan yang benar!
          </p>
        </motion.div>

        {/* ── PBL Steps ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 justify-start sm:justify-center"
        >
          {simulasi.pblSteps.map((s, i) => (
            <div key={s.step} className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${s.color}`}>
                <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center font-bold">
                  {s.step}
                </span>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < simulasi.pblSteps.length - 1 && (
                <span className="text-slate-300 text-sm">›</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Case Orientation Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6 flex gap-4"
        >
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-base sm:text-lg">{simulasi.subtitle}</p>
            <p className="text-red-700 mt-2 text-sm leading-relaxed">{simulasi.kasusDesc}</p>
          </div>
        </motion.div>

        {/* ── YouTube Video ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mb-3 aspect-video"
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${simulasi.youtubeId}?rel=0&modestbranding=1`}
            title={simulasi.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
        <p className="text-center font-semibold text-slate-700 mb-6 text-sm sm:text-base">
          🎬 {simulasi.title}
        </p>

        {/* ── Guided Questions ── */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 mb-4 overflow-hidden">
          <button
            onClick={() => { playClick(); setShowQuestions(!showQuestions); }}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Pertanyaan Pemandu Analisis
            </span>
            {showQuestions
              ? <ChevronUp className="w-5 h-5 text-slate-400" />
              : <ChevronDown className="w-5 h-5 text-slate-400" />
            }
          </button>
          <AnimatePresence>
            {showQuestions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3">
                  {simulasi.pertanyaan.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-3 items-start bg-yellow-50 rounded-xl p-3 border border-yellow-200"
                    >
                      <span className="font-bold text-yellow-600 shrink-0 text-sm">{i + 1}.</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{q}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Lembar Kerja Digital ── */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 mb-8 overflow-hidden">
          <button
            onClick={() => { playClick(); setShowWorksheet(!showWorksheet); }}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <ClipboardList className="w-5 h-5 text-purple-500" />
              📝 Lembar Kerja Digital
            </span>
            {showWorksheet
              ? <ChevronUp className="w-5 h-5 text-slate-400" />
              : <ChevronDown className="w-5 h-5 text-slate-400" />
            }
          </button>
          <AnimatePresence>
            {showWorksheet && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4">
                  <p className="text-xs text-slate-500 bg-purple-50 rounded-xl p-3 border border-purple-100">
                    📌 Isi lembar kerja ini berdasarkan hasil pengamatan video dan diskusi kamu. Jawaban tidak harus sempurna — yang penting ditulis dengan jujur dan penuh!
                  </p>
                  {lembarKerjaFields.map((field) => (
                    <div key={field.key}>
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">
                        {field.label}
                      </label>
                      <textarea
                        rows={3}
                        value={lembarKerja[field.key] ?? ""}
                        onChange={(e) => handleLembarKerja(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-sm text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                      saved
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {saved ? (
                      <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</>
                    ) : (
                      "💾 Simpan Jawaban"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <div className="text-center">
          <button
            onClick={() => { playClick(); router.push("/kuis"); }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base sm:text-lg"
          >
            Lanjut ke Kuis Evaluasi
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
