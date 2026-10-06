"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useClickSound } from "@/lib/useSound";
import {
  Trophy,
  Star,
  FlaskConical,
  BookOpen,
  Play,
  Printer,
  RotateCcw,
  CheckCircle2,
  LogOut,
  X,
  AlertTriangle,
  Award,
} from "lucide-react";

const motivasi = [
  { quote: "Ilmu tanpa amal seperti pohon tanpa buah.", author: "Pepatah" },
  { quote: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { quote: "Chemistry is the study of change. That's what chemists do—change things.", author: "Walter White, Breaking Bad" },
  { quote: "Keselamatan bukan aturan untuk membatasi kita, melainkan fondasi untuk kita berani bereksperimen.", author: "Prinsip Laboratorium" },
];

const pencapaian = [
  { icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />, label: "Pengenalan Alat Lab", sub: "15 alat laboratorium dipelajari" },
  { icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />, label: "Simulasi PBL", sub: "Studi kasus keselamatan kerja dianalisis" },
  { icon: <CheckCircle2 className="w-5 h-5 text-purple-500" />, label: "Simbol GHS", sub: "9 simbol bahaya dipahami" },
  { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, label: "Kuis Evaluasi", sub: "15 soal evaluasi diselesaikan" },
  { icon: <CheckCircle2 className="w-5 h-5 text-rose-500" />, label: "Refleksi Belajar", sub: "Jurnal refleksi pembelajaran tersimpan" },
];

const motivasiRandom = motivasi[Math.floor(Math.random() * motivasi.length)];

const getGrade = (skor: number) => {
  if (skor >= 90) return { label: "A - Sangat Baik", color: "text-yellow-600", emoji: "🏆" };
  if (skor >= 75) return { label: "B - Baik", color: "text-blue-600", emoji: "🌟" };
  if (skor >= 60) return { label: "C - Cukup", color: "text-green-600", emoji: "👍" };
  return { label: "D - Perlu Belajar Lagi", color: "text-slate-600", emoji: "📚" };
};

export default function PenutupPage() {
  const router = useRouter();
  const { nama, kelas, skor, waktuMulai, sudahLogin, reset, setStatusSelesai } = useAppStore();
  const playClick = useClickSound();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (sudahLogin) {
      setStatusSelesai(true);
    }
  }, [sudahLogin, setStatusSelesai]);

  const durasi = waktuMulai
    ? Math.max(1, Math.round((Date.now() - waktuMulai) / 60000))
    : 0;

  const grade = getGrade(skor);
  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    playClick();
    window.print();
  };

  const handleOpenLogout = () => {
    playClick();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    playClick();
    setShowLogoutModal(false);
    reset();
    router.push("/");
  };

  const handleCancelLogout = () => {
    playClick();
    setShowLogoutModal(false);
  };

  const handleUlangiKuis = () => {
    playClick();
    router.push("/kuis");
  };

  if (!sudahLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold cursor-pointer shadow-lg"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  return (
    <>
      {/* =========================================================
          SCREEN CONTENT (Hidden when printing via .no-print)
         ========================================================= */}
      <div className="no-print min-h-screen lab-pattern pb-20">
        <div className="max-w-3xl mx-auto px-4 pt-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              🎉 Halaman 6 dari 6 · Selesai!
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Selamat,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                {nama}!
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Kamu telah menyelesaikan seluruh rangkaian{" "}
              <strong>Lab Kimia Virtual Kelas X</strong>
            </p>
          </motion.div>

          {/* Achievement summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="glass rounded-2xl p-5 text-center border border-white/50 shadow">
              <p className="text-5xl font-extrabold text-blue-700">{skor}</p>
              <p className="text-sm text-slate-600 mt-1">Skor Kuis</p>
              <p className={`text-sm font-bold mt-1 ${grade.color}`}>
                {grade.emoji} {grade.label}
              </p>
            </div>
            <div className="glass rounded-2xl p-5 text-center border border-white/50 shadow">
              <p className="text-5xl font-extrabold text-green-700">{durasi}</p>
              <p className="text-sm text-slate-600 mt-1">Menit Belajar</p>
              <p className="text-sm font-bold text-green-600 mt-1">
                ⏱️ Waktu Pembelajaran
              </p>
            </div>
            <div className="glass rounded-2xl p-5 text-center border border-white/50 shadow">
              <p className="text-5xl font-extrabold text-purple-700">
                {pencapaian.length}
              </p>
              <p className="text-sm text-slate-600 mt-1">Topik Selesai</p>
              <p className="text-sm font-bold text-purple-600 mt-1">
                📚 {kelas}
              </p>
            </div>
          </motion.div>

          {/* Action buttons (Print, Ulangi Kuis, Keluar Lab) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Printer className="w-5 h-5" />
              Cetak Sertifikat
            </button>

            <button
              onClick={handleUlangiKuis}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow cursor-pointer text-sm sm:text-base"
            >
              <Play className="w-4 h-4" />
              Ulangi Kuis
            </button>

            <button
              onClick={handleOpenLogout}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow hover:scale-105 transition-all cursor-pointer text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              Keluar Lab
            </button>
          </motion.div>

          {/* Certificate Preview Card (On-Screen) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-amber-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm tracking-wide">
                  Pratinjau Sertifikat Kelulusan
                </h3>
              </div>
              <button
                onClick={handlePrint}
                className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak
              </button>
            </div>

            {/* Simulated certificate preview (Exact formal layout, NO EMOJIS) */}
            <div className="p-6 sm:p-8 bg-amber-50/30 font-serif text-slate-800">
              <div className="border-4 border-double border-amber-700 p-6 sm:p-8 rounded-xl bg-white text-center space-y-4 shadow-sm relative">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-widest text-amber-900 uppercase">
                    SERTIFIKAT KELULUSAN
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-slate-600 font-sans font-semibold mt-1">
                    Laboratorium Kimia Virtual - Kurikulum Merdeka
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Nomor: 421.3 / LAB-KIM / VIRTUAL / 2026
                  </p>
                  <div className="w-32 h-0.5 bg-amber-700 mx-auto mt-2" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500 italic">
                    Diberikan kepada:
                  </p>
                  <p className="text-2xl font-bold text-slate-900 underline decoration-amber-600 underline-offset-4">
                    {nama}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 font-sans">
                    Kelas: {kelas}
                  </p>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan rangkaian praktikum dan modul pembelajaran Laboratorium Kimia Virtual materi Pengenalan Alat Laboratorium dan Keselamatan Kerja berbasis Problem-Based Learning.
                </p>

                {/* Score badge - No emoji */}
                <div className="inline-flex items-center gap-6 px-6 py-2 rounded-xl bg-amber-50 border border-amber-300">
                  <div>
                    <span className="text-[10px] uppercase font-sans font-bold text-amber-900 block">
                      Nilai Akhir
                    </span>
                    <span className="text-2xl font-black text-amber-950">
                      {skor}
                    </span>
                    <span className="text-[10px] text-slate-500"> / 100</span>
                  </div>
                  <div className="h-8 w-px bg-amber-300" />
                  <div>
                    <span className="text-[10px] uppercase font-sans font-bold text-amber-900 block">
                      Predikat
                    </span>
                    <span className="text-sm font-bold text-amber-950">
                      {grade.label}
                    </span>
                  </div>
                </div>

                {/* Signature - Teacher Name & NIP */}
                <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-slate-200 mt-4 text-left">
                  <div className="text-[11px] text-slate-500 font-sans">
                    <p className="font-semibold text-slate-800">
                      Laboratorium Kimia Virtual
                    </p>
                    <p>Materi Keselamatan Kerja &amp; Alat Lab</p>
                    <p>Tingkat Kelas X</p>
                  </div>
                  <div className="text-right text-[11px] font-sans">
                    <p className="text-slate-600">Tanggal: {tanggalCetak}</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      Guru Mata Pelajaran Kimia,
                    </p>
                    <div className="h-12 flex items-end justify-end">
                      <div className="w-40 border-b border-slate-600" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-1 font-serif">
                      Fatma Alawiyah, S.Pd., Gr.
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                      NIP. 200103272025212017
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What you've learned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6"
          >
            <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Yang Telah Kamu Pelajari
            </h2>
            <div className="space-y-3">
              {pencapaian.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  {p.icon}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {p.label}
                    </p>
                    <p className="text-xs text-slate-500">{p.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Motivational quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-7 text-white text-center shadow-xl"
          >
            <Star className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
            <blockquote className="text-lg sm:text-xl font-bold leading-relaxed">
              &quot;{motivasiRandom.quote}&quot;
            </blockquote>
            <p className="text-blue-100 text-sm mt-3">— {motivasiRandom.author}</p>
          </motion.div>

          {/* Materi ringkasan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow border border-slate-200 p-6"
          >
            <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-500" />
              Ringkasan Materi
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                {
                  title: "Alat Gelas",
                  items: [
                    "Gelas Beker",
                    "Erlenmeyer",
                    "Labu Ukur",
                    "Gelas Ukur",
                    "Pipet Tetes",
                    "Pipet Volume",
                    "Buret",
                    "Tabung Reaksi",
                  ],
                },
                {
                  title: "Alat Non-Gelas & Pemanas",
                  items: [
                    "Pembakar Bunsen",
                    "Kaki Tiga & Kasa",
                    "Neraca Analitik",
                    "Batang Pengaduk",
                    "Spatula",
                    "Penjepit Tabung Reaksi",
                    "Corong",
                  ],
                },
                {
                  title: "Simbol Bahaya GHS",
                  items: [
                    "Eksplosif (GHS01)",
                    "Mudah Terbakar (GHS02)",
                    "Oksidator (GHS03)",
                    "Gas Bertekanan (GHS04)",
                    "Korosif (GHS05)",
                    "Beracun (GHS06)",
                    "Berbahaya (GHS07)",
                    "Bahaya Kesehatan (GHS08)",
                    "Bahaya Lingkungan (GHS09)",
                  ],
                },
                {
                  title: "Keselamatan Kerja",
                  items: [
                    "APD Lengkap (jas, kacamata, sarung tangan, sepatu)",
                    "Baca label sebelum menggunakan bahan kimia",
                    "Dilarang menghisap pipet dengan mulut",
                    "Isi tabung reaksi maks. 1/3 volume saat pemanasan",
                    "Buang limbah kimia di wadah khusus",
                    "Prosedur darurat tumpahan dan kecelakaan",
                  ],
                },
              ].map((sec) => (
                <div
                  key={sec.title}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <p className="font-bold text-slate-800 mb-2">{sec.title}</p>
                  <ul className="space-y-1">
                    {sec.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-slate-600 text-xs"
                      >
                        <span className="text-green-500 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-slate-400 text-xs pb-4">
            <p>Lab Kimia Virtual · Kelas X · Kurikulum Merdeka</p>
            <p className="mt-1">
              Dibuat untuk pembelajaran sains interaktif sekolah menengah
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          PRINT ONLY CERTIFICATE (ZERO EMOJIS, CLASSICAL ACADEMIC)
         ========================================================= */}
      <div className="print-only hidden font-serif text-slate-900 bg-white">
        <div className="w-full min-h-[600px] p-8 box-border flex flex-col justify-between border-[8px] border-double border-amber-800 bg-amber-50/20 rounded-lg relative">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-800" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-800" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-800" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-800" />

          {/* Certificate Header */}
          <div className="text-center pt-2">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-amber-950 mb-1">
              SERTIFIKAT KELULUSAN
            </h1>
            <p className="text-xs uppercase tracking-wider text-slate-600 font-sans font-semibold">
              Laboratorium Kimia Virtual - Kurikulum Merdeka
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Nomor: 421.3 / LAB-KIM / VIRTUAL / 2026
            </p>
            <div className="w-48 h-0.5 bg-amber-800 mx-auto mt-2" />
          </div>

          {/* Body */}
          <div className="text-center my-4 space-y-3">
            <p className="text-xs text-slate-600 italic">
              Sertifikat ini diberikan sebagai tanda kelulusan kepada:
            </p>
            <h2 className="text-3xl font-bold text-slate-950 tracking-wide underline decoration-amber-700 underline-offset-8">
              {nama}
            </h2>
            <p className="text-sm font-semibold text-slate-800 font-sans">
              Kelas: {kelas}
            </p>
            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed pt-2 font-sans">
              Telah berhasil menyelesaikan seluruh rangkaian praktikum dan modul pembelajaran Laboratorium Kimia Virtual materi Pengenalan Alat Laboratorium dan Keselamatan Kerja berbasis Problem-Based Learning dengan capaian evaluasi:
            </p>

            {/* Score & Grade without emojis */}
            <div className="inline-flex items-center gap-8 px-8 py-2.5 rounded-xl bg-amber-100/70 border border-amber-300 mx-auto">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-amber-900 block">
                  Nilai Evaluasi
                </span>
                <span className="text-2xl font-black text-amber-950">
                  {skor}
                </span>
                <span className="text-[11px] text-slate-600"> / 100</span>
              </div>
              <div className="h-8 w-px bg-amber-300" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-amber-900 block">
                  Predikat
                </span>
                <span className="text-base font-bold text-amber-950">
                  {grade.label}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-amber-300 mt-2 px-6">
            <div className="text-left text-xs text-slate-600 font-sans">
              <p className="font-semibold text-slate-800">
                Laboratorium Kimia Virtual
              </p>
              <p className="text-[11px] text-slate-500">
                Materi Keselamatan Kerja &amp; Alat Lab
              </p>
              <p className="text-[11px] text-slate-500">Tingkat Kelas X</p>
            </div>

            <div className="text-right text-xs">
              <p className="text-slate-700 font-sans mb-1">
                Tanggal: {tanggalCetak}
              </p>
              <p className="font-semibold text-slate-800 font-sans">
                Guru Mata Pelajaran Kimia,
              </p>

              {/* Space for signature */}
              <div className="h-16 flex items-end justify-end">
                <div className="w-52 border-b border-slate-700" />
              </div>

              <p className="font-bold text-slate-900 text-sm mt-1">
                Fatma Alawiyah, S.Pd., Gr.
              </p>
              <p className="text-[11px] text-slate-700 font-sans font-medium">
                NIP. 200103272025212017
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Logout */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCancelLogout}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm z-10 border border-slate-200"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={handleCancelLogout}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Keluar dari Laboratorium?
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah kamu yakin ingin keluar dari lab kimia? Sesi belajarmu akan diakhiri dan kamu akan kembali ke halaman utama.
                </p>

                <div className="flex gap-2 w-full pt-2">
                  <button
                    onClick={handleCancelLogout}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Ya, Keluar Lab
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
