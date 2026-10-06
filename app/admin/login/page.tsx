"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FlaskConical,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useClickSound } from "@/lib/useSound";

export default function TeacherLoginPage() {
  const router = useRouter();
  const playClick = useClickSound();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!username.trim() || !password) {
      setError("Harap isi username dan password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Username atau password salah.");
      }
    } catch {
      setError("Gagal terhubung ke server. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Lab Link */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          href="/lab"
          onClick={playClick}
          className="w-40 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Lab </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white backdrop-blur-2xl border border-blue-500 rounded-3xl white-2xl p-6 sm:p-8 space-y-6 relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-blue-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Portal Guru Kimia
          </h1>
          <p className="text-xs text-black">
            Sistem Manajemen Data Siswa &amp; Evaluasi Laboratorium Virtual
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-950">
              Username Guru
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-700 text-slate-950 placeholder-slate-950 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-950">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-950 text-slate-950 placeholder-slate-950 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard Guru</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Halaman ini hanya dapat diakses oleh Guru / Administrator</span>
        </div>
      </motion.div>
    </div>
  );
}
