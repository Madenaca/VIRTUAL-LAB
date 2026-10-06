"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Mail,
  Plus,
  ArrowUpRight,
  Video,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Download,
  Filter,
  Eye,
  Trash2,
  X,
  FileText,
  Heart,
  ExternalLink,
  ChevronRight,
  Flame,
  FlaskConical,
  Award,
  RefreshCw,
} from "lucide-react";
import { useClickSound } from "@/lib/useSound";
import Link from "next/link";

interface Student {
  id: number;
  session_id: string;
  nama: string;
  kelas: string;
  skor_kuis: number;
  durasi_menit: number;
  status_selesai: number;
  created_at: string;
  updated_at: string;
  lembar_kerja?: {
    penyebab: string;
    dampak: string;
    solusi: string;
    pencegahan: string;
  };
  jawaban_kuis?: Array<{
    soal_id: number;
    pilihan_siswa: number;
    is_benar: number;
  }>;
  refleksi?: {
    hal_baru: string;
    hal_menarik: string;
    belum_paham: string;
    penerapan: string;
    kesan: string;
    skala_pemahaman: number;
  };
}

export default function TeacherAdminDonezoPage() {
  const router = useRouter();
  const playClick = useClickSound();

  // Teacher Profile & Auth
  const [teacher, setTeacher] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Sidebar Menu
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "tasks" | "calendar" | "analytics" | "team">("dashboard");

  // Data from MySQL
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua");

  // Detail Modal
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  // Stopwatch / Time Tracker widget
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Stopwatch timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Verify Auth
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/teacher/me");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setTeacher(data.teacher);
      } else {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    } finally {
      setAuthChecking(false);
    }
  }, [router]);

  // Fetch Data from MySQL
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, statsRes] = await Promise.all([
        fetch(`/api/teacher/students?q=${encodeURIComponent(searchQuery)}&kelas=${encodeURIComponent(selectedClass)}`),
        fetch("/api/teacher/stats"),
      ]);

      const studentsData = await studentsRes.json();
      const statsData = await statsRes.json();

      if (studentsData.success) {
        setStudents(studentsData.students || []);
      }
      if (statsData.success) {
        setStats(statsData.stats || null);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedClass]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authChecking && teacher) {
      loadDashboardData();
    }
  }, [authChecking, teacher, loadDashboardData]);

  // Open Detail
  const handleOpenDetail = async (student: Student) => {
    playClick();
    setActiveStudent(student);
    try {
      const res = await fetch(`/api/teacher/students/${student.id}`);
      const data = await res.json();
      if (data.success && data.student) {
        setActiveStudent(data.student);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Student
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    playClick();
    try {
      const res = await fetch(`/api/teacher/students/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = async () => {
    playClick();
    await fetch("/api/auth/teacher/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Export CSV
  const handleExportCSV = () => {
    playClick();
    if (students.length === 0) return;

    const headers = ["No", "Nama Siswa", "Kelas", "Nilai Kuis", "Status Kelulusan", "Durasi (Menit)", "Tanggal"];
    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.nama}"`,
      `"${s.kelas}"`,
      s.skor_kuis,
      s.skor_kuis >= 75 ? "LULUS" : "REMIDIAL",
      s.durasi_menit,
      new Date(s.created_at).toLocaleDateString("id-ID"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_Lab_Kimia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#14532d]" />
          <span>Memverifikasi sesi guru...</span>
        </div>
      </div>
    );
  }

  // Derived metric values
  const totalCount = stats?.totalStudents || students.length || 24;
  const passCount = stats?.passCount || students.filter((s) => s.skor_kuis >= 75).length || 18;
  const inProgressCount = students.filter((s) => s.status_selesai === 0).length || 12;
  const pendingCount = students.filter((s) => s.skor_kuis < 75 && s.skor_kuis > 0).length || 2;
  const passPercentage = stats?.passRate || 74;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex font-sans antialiased">
      {/* ============================================================
          1. LEFT SIDEBAR (Donezo Style)
          ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="space-y-7">
          {/* Navigation Section: MENU */}
          <div className="space-y-1">
            <button
              onClick={() => {
                playClick();
                setActiveMenu("dashboard");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeMenu === "dashboard"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

            <div className="relative z-10 space-y-3">
              <Link
                href="/lab"
                onClick={playClick}
                className="block w-full py-2 bg-amber-400 hover:bg-amber-400 text-center rounded-xl text-xs font-bold text-white border border-amber-500/30 transition-colors cursor-pointer"
              >
                Buka Lab Siswa
              </Link>
            </div>

          <div className="space-y-1 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-red-300 text-sm font-semibold text-red-600 hover:bg-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================
          2. MAIN CONTENT AREA
          ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Search Input with Keyboard Shortcut Badge */}
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search task or student..."
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#154734] transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              ⌘F
            </div>
          </div>

          {/* Right Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Profile Avatar & Text */}
            <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
              {/* Avatar image circular */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 overflow-hidden flex items-center justify-center text-white font-bold shadow-sm">
                <img
                  src="/gambar/fatma.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {teacher?.nama || "Fatma Alawiyah, S.Pd., Gr."}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
                  NIP. {teacher?.nip || "200103272025212017"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 space-y-6">
          {/* ============================================================
              6. DATABASE MYSQL DATA TABLE: DATA SISWA LAB KIMIA
              ============================================================ */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Data Siswa &amp; Rekap Nilai Praktikum</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Data langsung tersinkronisasi dari aktivitas siswa di
                  front-end.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Class Filter */}
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
                >
                  {[
                    "Semua",
                    "X.1",
                    "X.2",
                    "X.3",
                    "X.4",
                    "X.5",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3 font-bold">No</th>
                    <th className="py-3 px-3 font-bold">Nama Lengkap</th>
                    <th className="py-3 px-3 font-bold">Kelas</th>
                    <th className="py-3 px-3 font-bold">Nilai Kuis</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold">Durasi</th>
                    <th className="py-3 px-3 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-slate-400"
                      >
                        Belum ada siswa yang terekam atau data tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    students.map((s, idx) => {
                      const isPass = s.skor_kuis >= 75;
                      return (
                        <tr
                          key={s.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-3 text-slate-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {s.nama}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {s.kelas}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-extrabold px-2.5 py-1 rounded-lg text-xs font-mono ${
                                isPass
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {s.skor_kuis} / 100
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPass
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {isPass ? "Lulus KKM" : "Remidial"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {s.durasi_menit} Menit
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenDetail(s)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detail</span>
                              </button>
                              <button
                                onClick={() => setDeleteTarget(s)}
                                className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================
          7. MODAL DETAIL JAWABAN & REFLEKSI SISWA
          ============================================================ */}
      <AnimatePresence>
        {activeStudent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveStudent(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-[#154734] text-white p-5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold">{activeStudent.nama}</h3>
                  <p className="text-xs text-emerald-200">
                    Kelas: {activeStudent.kelas} · Nilai Kuis:{" "}
                    {activeStudent.skor_kuis} / 100
                  </p>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
                {/* Lembar Kerja PBL */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5 text-[#154734]">
                    <FileText className="w-4 h-4" />
                    <span>Lembar Kerja Problem-Based Learning</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block text-xs">
                        Penyebab Masalah:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeStudent.lembar_kerja?.penyebab ||
                          "(Belum diisi)"}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block text-xs">
                        Dampak yang Ditimbulkan:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeStudent.lembar_kerja?.dampak || "(Belum diisi)"}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block text-xs">
                        Solusi &amp; Prosedur Benar:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeStudent.lembar_kerja?.solusi || "(Belum diisi)"}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block text-xs">
                        Langkah Pencegahan:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeStudent.lembar_kerja?.pencegahan ||
                          "(Belum diisi)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Jurnal Refleksi */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-rose-600 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>Jurnal Refleksi Pembelajaran Siswa</span>
                  </h4>

                  <div className="space-y-2 text-slate-600">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-800 block text-xs">
                        Hal Baru:
                      </span>
                      <p className="mt-0.5">
                        {activeStudent.refleksi?.hal_baru || "(Belum diisi)"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-800 block text-xs">
                        Hal Menarik:
                      </span>
                      <p className="mt-0.5">
                        {activeStudent.refleksi?.hal_menarik || "(Belum diisi)"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-xs">
                        Skala Pemahaman:
                      </span>
                      <span className="font-bold text-amber-500">
                        ⭐ {activeStudent.refleksi?.skala_pemahaman || 0} / 5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveStudent(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10 text-center space-y-4 shadow-xl border border-slate-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Data Siswa?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Data hasil kuis dan refleksi{" "}
                  <strong>{deleteTarget.nama}</strong> akan dihapus dari
                  database.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
