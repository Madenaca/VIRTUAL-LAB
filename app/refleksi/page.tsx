"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { ArrowRight, Heart, Star, Smile, HelpCircle, Lightbulb, CheckCircle2 } from "lucide-react";

const pertanyaan = [
  {
    id: "hal-baru",
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    label: "💡 Hal Baru yang Dipelajari",
    pertanyaan: "Hal baru apa yang kamu pelajari hari ini tentang laboratorium kimia?",
    placeholder: "Contoh: Saya belajar bahwa menghisap pipet dengan mulut sangat berbahaya, dan harus menggunakan propipet...",
    warna: "border-yellow-300 bg-yellow-50",
  },
  {
    id: "hal-menarik",
    icon: <Star className="w-5 h-5 text-blue-500" />,
    label: "⭐ Hal yang Paling Menarik",
    pertanyaan: "Apa bagian yang paling menarik atau mengejutkan dari materi hari ini?",
    placeholder: "Contoh: Saya terkejut bahwa ada 9 simbol bahaya GHS yang berbeda, dan setiap simbol punya arti khusus...",
    warna: "border-blue-300 bg-blue-50",
  },
  {
    id: "belum-paham",
    icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
    label: "❓ Hal yang Belum Dipahami",
    pertanyaan: "Apa yang masih membingungkan atau belum kamu pahami sepenuhnya?",
    placeholder: "Contoh: Saya masih bingung tentang perbedaan fungsi gelas beker dan erlenmeyer dalam titrasi...",
    warna: "border-purple-300 bg-purple-50",
  },
  {
    id: "penerapan",
    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    label: "🌱 Penerapan dalam Kehidupan",
    pertanyaan: "Bagaimana kamu akan menerapkan pengetahuan ini dalam kehidupan nyata atau praktikum berikutnya?",
    placeholder: "Contoh: Saya akan selalu memakai APD lengkap dan membaca label bahan kimia sebelum menggunakannya...",
    warna: "border-green-300 bg-green-50",
  },
  {
    id: "kesan",
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    label: "💬 Kesan & Pesan",
    pertanyaan: "Tuliskan kesan dan pesan kamu setelah mengikuti Lab Kimia Virtual hari ini.",
    placeholder: "Contoh: Pembelajaran hari ini sangat menyenangkan dan membuka wawasan saya tentang pentingnya keselamatan kerja...",
    warna: "border-rose-300 bg-rose-50",
  },
];

const skalaPemahaman = [
  { val: 1, emoji: "😞", label: "Sangat Belum Paham" },
  { val: 2, emoji: "😕", label: "Belum Paham" },
  { val: 3, emoji: "😐", label: "Cukup Paham" },
  { val: 4, emoji: "😊", label: "Paham" },
  { val: 5, emoji: "🤩", label: "Sangat Paham" },
];

export default function RefleksiPage() {
  const router = useRouter();
  const { sudahLogin, nama, skor, setRefleksi } = useAppStore();
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [skala, setSkala] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!sudahLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => router.push("/")} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  const handleChange = (id: string, val: string) => {
    setJawaban((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = () => {
    Object.entries(jawaban).forEach(([k, v]) => setRefleksi(k, v));
    setRefleksi("skala-pemahaman", String(skala ?? 0));
    setSubmitted(true);
  };

  const allFilled = pertanyaan.every((p) => jawaban[p.id]?.trim().length > 10) && skala !== null;

  if (submitted) {
    return (
      <div className="min-h-screen lab-pattern flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-white/50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Heart className="w-16 h-16 text-rose-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-slate-800">Refleksi Tersimpan! 💾</h2>
          <p className="text-slate-600 text-sm">
            Terima kasih, <strong>{nama}</strong>! Refleksimu sangat berharga untuk perkembangan belajarmu.
          </p>
          <div className="bg-slate-100 rounded-2xl py-4 px-6">
            <p className="text-sm text-slate-600">Skor Kuis Kamu</p>
            <p className="text-4xl font-extrabold text-blue-700">{skor}</p>
            <p className="text-sm text-slate-500">dari 100</p>
          </div>
          <button
            onClick={() => router.push("/penutup")}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Lanjut ke Halaman Penutup <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lab-pattern pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Heart className="w-4 h-4" /> Halaman 5 dari 6 · Refleksi
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
            Jurnal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Refleksi
            </span>{" "}
            Belajar
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
            Refleksikan pengalaman belajarmu hari ini. Jawab setiap pertanyaan dengan jujur dan penuh!
          </p>
        </motion.div>

        <div className="space-y-5">
          {pertanyaan.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl shadow border-2 ${p.warna} p-6 space-y-3`}
            >
              <div className="flex items-center gap-2">
                {p.icon}
                <span className="font-bold text-slate-800">{p.label}</span>
              </div>
              <p className="text-slate-600 text-sm">{p.pertanyaan}</p>
              <textarea
                rows={4}
                value={jawaban[p.id] ?? ""}
                onChange={(e) => handleChange(p.id, e.target.value)}
                placeholder={p.placeholder}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-sm text-slate-700 placeholder-slate-400 bg-white"
              />
              {jawaban[p.id]?.trim().length > 0 && (
                <p className="text-xs text-slate-400 text-right">
                  {jawaban[p.id].trim().length} karakter
                </p>
              )}
            </motion.div>
          ))}

          {/* Skala pemahaman */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow border-2 border-indigo-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-slate-800">📊 Skala Pemahamanmu</span>
            </div>
            <p className="text-slate-600 text-sm">
              Seberapa paham kamu dengan materi laboratorium kimia setelah pembelajaran hari ini?
            </p>
            <div className="flex justify-between gap-2">
              {skalaPemahaman.map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSkala(s.val)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                    skala === s.val
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-[10px] text-slate-600 font-semibold text-center leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <AnimatePresence>
            {allFilled && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Simpan Refleksi & Lanjut
              </motion.button>
            )}
          </AnimatePresence>
          {!allFilled && (
            <p className="text-center text-xs text-slate-400">
              * Isi semua pertanyaan dan pilih skala pemahaman untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
