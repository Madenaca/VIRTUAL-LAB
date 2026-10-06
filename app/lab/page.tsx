"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useClickSound } from "@/lib/useSound";
import { alatLab, simbolBahaya, aturanKeselamatan, type AlatLab } from "@/lib/alat-lab";
import Lab3DViewer from "@/components/Lab3DViewer";
import {
  ArrowRight, CheckCircle2, XCircle, FlaskConical,
  Shield, TriangleAlert, X, Info, AlertTriangle, BookOpen, Box, Camera,
} from "lucide-react";

/* ============================================================
   MODAL POPUP — Alat Lab dengan 3D Model 360° & Foto
   ============================================================ */
function AlatModal({ alat, onClose }: { alat: AlatLab; onClose: () => void }) {
  const [viewMode, setViewMode] = useState<"3d" | "foto">("3d");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg z-10 my-auto max-h-[90vh] flex flex-col"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        {/* Header with Title & Mode Switcher */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{alat.emoji}</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">{alat.nama}</h2>
              <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
                Kategori: {alat.kategori}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle 3D vs Foto */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "3d"
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D 360°</span>
              </button>

              <button
                onClick={() => setViewMode("foto")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "foto"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Content: 3D Model vs Photo */}
        <div className="relative bg-slate-950 shrink-0">
          {viewMode === "3d" ? (
            <div className="p-2 sm:p-3">
              <Lab3DViewer
                alatId={alat.id}
                nama={alat.nama}
                warnaGradien={alat.warna}
                className="w-full h-64 sm:h-72"
              />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-72 relative bg-slate-900 flex items-center justify-center p-4">
              <Image
                src={alat.gambar}
                alt={alat.nama}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, 500px"
              />
            </div>
          )}
        </div>

        {/* Scrollable Information Body */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1">
          <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-blue-800 text-xs sm:text-sm">Fungsi Utama</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{alat.fungsi}</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-3.5 border border-green-100">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-bold text-green-800 text-xs sm:text-sm">Cara Penggunaan yang Benar</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{alat.cara}</p>
          </div>

          <div className="bg-red-50 rounded-2xl p-3.5 border border-red-200">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-bold text-red-800 text-xs sm:text-sm">Perhatian Keselamatan Kerja</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{alat.peringatan}</p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   MODAL POPUP — Simbol Bahaya
   ============================================================ */
type SimbolBahayaType = typeof simbolBahaya[number];
function SimbolModal({ simbol, onClose }: { simbol: SimbolBahayaType; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm z-10"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="p-6 text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>

          {/* Simbol image */}
          <div className={`mx-auto w-32 h-32 rounded-2xl overflow-hidden border-4 ${simbol.warna} flex items-center justify-center`}>
            <Image
              src={simbol.gambar}
              alt={simbol.nama}
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-mono text-slate-400">{simbol.kode}</p>
            <h2 className="text-2xl font-extrabold text-slate-800">{simbol.nama}</h2>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Arti</p>
              <p className="text-sm text-slate-700">{simbol.teks}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Contoh Bahan</p>
              <p className="text-sm text-slate-700 font-medium">{simbol.contoh}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 text-white rounded-2xl font-semibold hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   ALAT CARD — Tampil gambar asli, klik buka popup
   ============================================================ */
function AlatCard({ alat, onClick }: { alat: AlatLab; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white text-left w-full cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-36 sm:h-40 overflow-hidden bg-slate-100 relative">
        <Image
          src={alat.gambar}
          alt={alat.nama}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* 3D Badge */}
        <div className="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow">
          <Box className="w-3 h-3 text-cyan-400" />
          <span>3D 360°</span>
        </div>
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${alat.warna} opacity-30 group-hover:opacity-20 transition-opacity`} />
        {/* Click hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
            <Box className="w-3.5 h-3.5 text-cyan-600" /> Putar 3D
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="px-3 py-3">
        <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2">
          {alat.nama}
        </p>
        <p className="text-xs text-slate-400 mt-1 capitalize">{alat.kategori}</p>
      </div>
    </motion.button>
  );
}

/* ============================================================
   SIMBOL CARD
   ============================================================ */
function SimbolCard({ simbol, onClick }: { simbol: SimbolBahayaType; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`group ${simbol.warna} border-2 rounded-2xl p-4 cursor-pointer text-left w-full`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm">
          <Image
            src={simbol.gambar}
            alt={simbol.nama}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{simbol.nama}</p>
          <p className="text-xs text-slate-500 font-mono">{simbol.kode}</p>
        </div>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2">{simbol.teks}</p>
      <p className="text-xs text-blue-600 font-semibold mt-2 group-hover:underline">
        Klik untuk detail →
      </p>
    </motion.button>
  );
}

/* ============================================================
   TABS
   ============================================================ */
const tabs = [
  { id: "alat-gelas", label: "Alat Gelas", emoji: "🧪" },
  { id: "alat-lain", label: "Alat Lainnya", emoji: "⚗️" },
  { id: "simbol", label: "Simbol Bahaya", emoji: "⚠️" },
  { id: "keselamatan", label: "Keselamatan", emoji: "🛡️" },
];

/* ============================================================
   PAGE
   ============================================================ */
export default function LabPage() {
  const router = useRouter();
  const { sudahLogin } = useAppStore();
  const playClick = useClickSound();

  const [activeTab, setActiveTab] = useState("alat-gelas");
  const [selectedAlat, setSelectedAlat] = useState<AlatLab | null>(null);
  const [selectedSimbol, setSelectedSimbol] = useState<SimbolBahayaType | null>(null);

  const alatGelas = alatLab.filter((a) => a.kategori === "gelas");
  const alatLain = alatLab.filter((a) => a.kategori !== "gelas");

  const handleAlatClick = (alat: AlatLab) => {
    playClick();
    setSelectedAlat(alat);
  };

  const handleSimbolClick = (simbol: SimbolBahayaType) => {
    playClick();
    setSelectedSimbol(simbol);
  };

  const handleTabClick = (id: string) => {
    playClick();
    setActiveTab(id);
  };

  if (!sudahLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-slate-600">Kamu belum login.</p>
          <button
            onClick={() => { playClick(); router.push("/"); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lab-pattern pb-20">
      {/* Modals */}
      <AnimatePresence>
        {selectedAlat && (
          <AlatModal alat={selectedAlat} onClose={() => { playClick(); setSelectedAlat(null); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedSimbol && (
          <SimbolModal simbol={selectedSimbol} onClose={() => { playClick(); setSelectedSimbol(null); }} />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <FlaskConical className="w-4 h-4" /> Halaman 2 dari 6
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800">
            Pengenalan Alat &amp; Keselamatan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Laboratorium
            </span>
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
            Klik kartu alat atau simbol untuk melihat penjelasan lengkap dengan animasi popup!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 justify-center flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ── ALAT GELAS ── */}
          {activeTab === "alat-gelas" && (
            <motion.div
              key="alat-gelas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-xs text-slate-400 mb-4 text-center">
                👆 Klik kartu untuk melihat fungsi, cara penggunaan, dan peringatan keselamatan
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {alatGelas.map((alat) => (
                  <AlatCard key={alat.id} alat={alat} onClick={() => handleAlatClick(alat)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ALAT LAINNYA ── */}
          {activeTab === "alat-lain" && (
            <motion.div
              key="alat-lain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-xs text-slate-400 mb-4 text-center">
                👆 Klik kartu untuk melihat fungsi, cara penggunaan, dan peringatan keselamatan
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {alatLain.map((alat) => (
                  <AlatCard key={alat.id} alat={alat} onClick={() => handleAlatClick(alat)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SIMBOL BAHAYA ── */}
          {activeTab === "simbol" && (
            <motion.div
              key="simbol"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex gap-3 items-start">
                <TriangleAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-amber-800">Sistem GHS (Globally Harmonized System)</p>
                  <p className="text-amber-700 text-sm mt-1">
                    GHS adalah sistem internasional pengklasifikasian dan pelabelan bahan kimia berbahaya.
                    <strong> Klik tiap simbol</strong> untuk melihat penjelasan lengkap!
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {simbolBahaya.map((simbol, i) => (
                  <motion.div
                    key={simbol.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <SimbolCard simbol={simbol} onClick={() => handleSimbolClick(simbol)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── KESELAMATAN ── */}
          {activeTab === "keselamatan" && (
            <motion.div
              key="keselamatan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Do's */}
              <div className="bg-white rounded-2xl shadow border border-green-200 p-6">
                <h3 className="font-bold text-green-700 text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Yang HARUS Dilakukan (Do&apos;s)
                </h3>
                <ul className="space-y-3">
                  {aturanKeselamatan.dos.map((rule, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-white rounded-2xl shadow border border-red-200 p-6">
                <h3 className="font-bold text-red-700 text-lg mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Yang TIDAK Boleh Dilakukan (Don&apos;ts)
                </h3>
                <ul className="space-y-3">
                  {aturanKeselamatan.donts.map((rule, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Emergency */}
              <div className="md:col-span-2 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-700 text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  🚨 Prosedur Darurat
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Tumpahan Bahan Kimia",
                      icon: "🧪",
                      steps: [
                        "Jauhkan dari area tumpahan",
                        "Beritahu guru segera",
                        "Bilas kulit dengan air 15-20 menit",
                        "Gunakan bahan penyerap khusus",
                      ],
                    },
                    {
                      title: "Kebakaran",
                      icon: "🔥",
                      steps: [
                        "Matikan sumber api",
                        "Evakuasi lab segera",
                        "Gunakan APAR jika api kecil",
                        "Hubungi pemadam kebakaran",
                      ],
                    },
                    {
                      title: "Kecelakaan Mata",
                      icon: "👁️",
                      steps: [
                        "Cuci mata di eyewash station",
                        "Bilas 15-20 menit terus-menerus",
                        "Jangan menggosok mata",
                        "Segera ke unit medis",
                      ],
                    },
                  ].map((proc) => (
                    <div key={proc.title} className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">{proc.icon}</span>
                        {proc.title}
                      </p>
                      <ol className="space-y-1">
                        {proc.steps.map((step, i) => (
                          <li key={i} className="text-xs text-slate-600 flex gap-2">
                            <span className="font-bold text-red-500 shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => { playClick(); router.push("/simulasi"); }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base sm:text-lg"
          >
            Lanjut ke Simulasi PBL
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
