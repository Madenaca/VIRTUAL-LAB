"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useClickSound } from "@/lib/useSound";
import {
  FlaskConical,
  User,
  BookOpen,
  Play,
  HelpCircle,
  Heart,
  LogOut,
  X,
  AlertTriangle,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/lab", label: "Alat 3D", icon: BookOpen },
  { href: "/simulasi", label: "Simulasi", icon: Play },
  { href: "/game", label: "Game Lab", icon: Gamepad2 },
  { href: "/kuis", label: "Kuis", icon: HelpCircle },
  { href: "/refleksi", label: "Refleksi", icon: Heart },
  { href: "/penutup", label: "Penutup", icon: FlaskConical },
];

export default function Navbar() {
  const { nama, kelas, sudahLogin, isAdmin, reset, logoutAdmin } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const playClick = useClickSound();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Hide on login page or admin pages
  if (!sudahLogin || pathname === "/" || pathname.startsWith("/admin")) return null;

  const handleOpenLogout = () => {
    playClick();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    playClick();
    setShowLogoutModal(false);
    if (isAdmin) {
      await logoutAdmin();
      router.push("/admin/login");
    } else {
      reset();
      router.push("/");
    }
  };

  const handleReturnToDashboard = () => {
    playClick();
    setShowLogoutModal(false);
    router.push("/admin");
  };

  const handleCancelLogout = () => {
    playClick();
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="no-print sticky top-0 z-40 glass border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link
            href="/lab"
            onClick={playClick}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-700 hidden xl:block text-sm">
              Lab Kimia Virtual
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={playClick}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User info, Teacher Portal, & Logout button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Teacher Portal / Back to Dashboard Link */}
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={playClick}
                title="Kembali ke Dashboard Guru"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0c4a6e] to-sky-600 hover:from-[#075985] hover:to-sky-500 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard Guru</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={playClick}
                title="Portal Khusus Guru"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Portal Guru</span>
              </Link>
            )}

            {/* User badge */}
            <div
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border transition-colors ${
                isAdmin
                  ? "bg-sky-50/90 border-sky-200/80 text-sky-950"
                  : "bg-slate-100/90 border-slate-200/60"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
              <div className="text-xs">
                <p className="font-bold text-slate-800 leading-none max-w-[80px] sm:max-w-[120px] truncate">
                  {nama}
                </p>
                <p
                  className={`leading-none mt-0.5 text-[10px] ${
                    isAdmin ? "text-sky-600 font-semibold" : "text-slate-500"
                  }`}
                >
                  {isAdmin ? "Mode Guru" : kelas}
                </p>
              </div>
            </div>

            {/* Logout / Exit Button */}
            <button
              onClick={handleOpenLogout}
              title={isAdmin ? "Kembali / Keluar Mode Guru" : "Keluar dari Laboratorium"}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAdmin ? "Keluar" : "Keluar"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal Logout */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCancelLogout}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Card */}
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm z-10 border border-slate-200"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={handleCancelLogout}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isAdmin ? "bg-sky-100 text-sky-700" : "bg-red-100 text-red-600"}`}>
                  {isAdmin ? <GraduationCap className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {isAdmin ? "Sesi Lab Guru" : "Keluar dari Laboratorium?"}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAdmin
                    ? "Anda sedang mengakses laboratorium sebagai Guru / Admin. Anda dapat kembali ke Dashboard Guru atau mengakhiri sesi."
                    : "Apakah kamu yakin ingin keluar? Sesi belajarmu akan diakhiri dan kamu akan kembali ke halaman utama laboratorium."}
                </p>

                <div className="flex flex-col gap-2 w-full pt-2">
                  {isAdmin && (
                    <button
                      onClick={handleReturnToDashboard}
                      className="w-full py-2.5 rounded-xl bg-[#0c4a6e] text-white font-semibold text-xs hover:bg-[#075985] shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Kembali ke Dashboard Guru
                    </button>
                  )}
                  <div className="flex gap-2 w-full">
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
                      {isAdmin ? "Logout Sesi" : "Ya, Keluar Lab"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
