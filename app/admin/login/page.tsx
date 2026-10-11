"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useClickSound } from "@/lib/useSound";
import { useAppStore } from "@/lib/useAppStore";

export default function TeacherLoginPage() {
  const router = useRouter();
  const playClick = useClickSound();
  const { setAdminLogin } = useAppStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if teacher is already logged in
  useEffect(() => {
    fetch("/api/auth/teacher/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.teacher) {
          setAdminLogin(data.teacher);
          router.replace("/admin");
        }
      })
      .catch(() => {});
  }, [router, setAdminLogin]);

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
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.teacher) {
          setAdminLogin(data.teacher);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Links */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
        <Link
          href="/"
          onClick={playClick}
          className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 backdrop-blur-md"
        >
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span>Beranda</span>
        </Link>
        <Link
          href="/lab"
          onClick={playClick}
          className="px-3.5 py-2.5 bg-blue-600/80 hover:bg-blue-500/80 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ke Lab</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Guru Kimia
          </h1>
          <p className="text-xs text-slate-500">
            Masuk dengan username dan password untuk mengelola data &amp; evaluasi siswa
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Username Guru
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username (contoh: guru_kimia / admin)"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
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
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Akses khusus Tenaga Pendidik &amp; Administrator Lab</span>
        </div>
      </motion.div>
    </div>
  );
}
