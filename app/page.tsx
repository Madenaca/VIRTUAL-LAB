"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, User, School, ArrowRight, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/useAppStore";
import APDAnimation from "@/components/APDAnimation";

const kelasList = [
  "X.1", "X.2", "X.3", "X.4", "X.5",
];

export default function HomePage() {
  const router = useRouter();
  const { setNama, setKelas, setSudahLogin, setWaktuMulai } = useAppStore();

  const [nama, setNamaLocal] = useState("");
  const [kelas, setKelasLocal] = useState("");
  const [showAPD, setShowAPD] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) { setError("Nama tidak boleh kosong!"); return; }
    if (!kelas) { setError("Pilih kelas terlebih dahulu!"); return; }
    setError("");
    setNama(nama.trim());
    setKelas(kelas);
    setShowAPD(true);
  };

  const handleEnterLab = () => {
    setSudahLogin(true);
    setWaktuMulai(Date.now());
    router.push("/lab");
  };
  
  const handleGuru = () => {
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen lab-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {!showAPD ? (
            /* === LOGIN FORM === */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {/* Left: Hero */}
              <div className="text-center md:text-left space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl shadow-2xl"
                >
                  <FlaskConical className="w-12 h-12 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight"
                  >
                    Laboratorium{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                      Kimia Virtual
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 text-slate-600 text-lg"
                  >
                    Belajar keselamatan dan alat laboratorium secara interaktif
                    berbasis <strong>Problem-Based Learning</strong>
                  </motion.p>
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { emoji: "🥼", label: "Animasi APD" },
                    { emoji: "🔬", label: "Pengenalan Alat" },
                    { emoji: "🎬", label: "Simulasi PBL" },
                    { emoji: "📝", label: "Kuis Evaluasi" },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2 border border-white shadow-sm"
                    >
                      <span className="text-xl">{f.emoji}</span>
                      <span className="text-sm font-medium text-slate-700">
                        {f.label}
                      </span>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-700 font-medium">
                    Kelas X · Kurikulum Merdeka
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleGuru}
                    title="Portal Khusus Guru"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <span>Login Guru</span>
                  </button>
                </motion.div>
              </div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl shadow-2xl p-8 border border-white/50"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Selamat Datang! 👋
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  Isi data dirimu untuk memulai perjalanan belajar
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <User className="inline w-4 h-4 mr-1" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNamaLocal(e.target.value)}
                      placeholder="Masukkan nama lengkapmu..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white transition-colors text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <School className="inline w-4 h-4 mr-1" />
                      Kelas
                    </label>
                    <select
                      value={kelas}
                      onChange={(e) => setKelasLocal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white transition-colors text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm font-medium flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" /> {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    Mulai Belajar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            /* === APD ANIMATION === */
            <motion.div
              key="apd"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass rounded-3xl shadow-2xl p-8 border border-white/50">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Kenakan APD Terlebih Dahulu! 🥼
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Sebelum masuk laboratorium, pastikan kamu memakai semua alat
                    pelindung diri
                  </p>
                </div>
                <APDAnimation onComplete={handleEnterLab} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
