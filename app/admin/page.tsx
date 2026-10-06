"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Search,
  Download,
  Eye,
  Trash2,
  X,
  FileText,
  Heart,
  RefreshCw,
  FlaskConical,
  Users,
  Award,
  Clock,
  TrendingUp,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  ChevronRight,
  Beaker,
  Target,
  Percent,
  Timer,
  FileSpreadsheet,
  ClipboardList,
  Menu,
} from "lucide-react";
import { useClickSound } from "@/lib/useSound";
import Link from "next/link";

/* ─── Types ─── */
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

/* ─── Utility helpers ─── */
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getScoreColor(score: number) {
  if (score >= 90) return { text: "text-emerald-700", bg: "bg-emerald-500", light: "bg-emerald-50" };
  if (score >= 75) return { text: "text-sky-700", bg: "bg-sky-500", light: "bg-sky-50" };
  if (score >= 60) return { text: "text-amber-700", bg: "bg-amber-500", light: "bg-amber-50" };
  return { text: "text-rose-700", bg: "bg-rose-500", light: "bg-rose-50" };
}

function getScoreGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  return "D";
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-cyan-500 to-teal-600",
  "from-fuchsia-500 to-pink-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
export default function TeacherDashboardPage() {
  const router = useRouter();
  const playClick = useClickSound();

  /* State */
  const [teacher, setTeacher] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Auth */
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

  /* Fetch data */
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, statsRes] = await Promise.all([
        fetch(`/api/teacher/students?q=${encodeURIComponent(searchQuery)}&kelas=${encodeURIComponent(selectedClass)}`),
        fetch("/api/teacher/stats"),
      ]);
      const studentsData = await studentsRes.json();
      const statsData = await statsRes.json();
      if (studentsData.success) setStudents(studentsData.students || []);
      if (statsData.success) setStats(statsData.stats || null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedClass]);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!authChecking && teacher) loadDashboardData();
  }, [authChecking, teacher, loadDashboardData]);

  /* Actions */
  const handleOpenDetail = async (student: Student) => {
    playClick();
    setActiveStudent(student);
    try {
      const res = await fetch(`/api/teacher/students/${student.id}`);
      const data = await res.json();
      if (data.success && data.student) setActiveStudent(data.student);
    } catch (err) { console.error(err); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    playClick();
    try {
      const res = await fetch(`/api/teacher/students/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) { setDeleteTarget(null); loadDashboardData(); }
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    playClick();
    await fetch("/api/auth/teacher/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleExportCSV = () => {
    playClick();
    if (students.length === 0) return;
    const headers = ["No", "Nama Siswa", "Kelas", "Nilai Kuis", "Status Kelulusan", "Durasi (Menit)", "Tanggal"];
    const rows = students.map((s, idx) => [
      idx + 1, `"${s.nama}"`, `"${s.kelas}"`, s.skor_kuis,
      s.skor_kuis >= 75 ? "LULUS" : "REMIDIAL", s.durasi_menit,
      new Date(s.created_at).toLocaleDateString("id-ID"),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Rekap_Nilai_Lab_Kimia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Derived metrics */
  const metrics = useMemo(() => {
    const total = stats?.totalStudents || students.length || 0;
    const pass = stats?.passCount || students.filter((s) => s.skor_kuis >= 75).length || 0;
    const fail = students.filter((s) => s.skor_kuis < 75 && s.skor_kuis > 0).length || 0;
    const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
    const avg = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.skor_kuis, 0) / students.length) : 0;
    const avgDur = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.durasi_menit, 0) / students.length) : 0;
    const gradeA = students.filter((s) => s.skor_kuis >= 90).length;
    const gradeB = students.filter((s) => s.skor_kuis >= 75 && s.skor_kuis < 90).length;
    const gradeC = students.filter((s) => s.skor_kuis >= 60 && s.skor_kuis < 75).length;
    const gradeD = students.filter((s) => s.skor_kuis < 60 && s.skor_kuis > 0).length;
    const highest = students.length > 0 ? Math.max(...students.map((s) => s.skor_kuis)) : 0;
    const lowest = students.length > 0 ? Math.min(...students.map((s) => s.skor_kuis)) : 0;
    return { total, pass, fail, passRate, avg, avgDur, gradeA, gradeB, gradeC, gradeD, highest, lowest };
  }, [students, stats]);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  /* Loading screen */
  if (authChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0c4a6e] flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <motion.div
              className="absolute -inset-1.5 rounded-2xl border-2 border-sky-300"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">Memuat Dashboard</p>
            <p className="text-xs text-slate-400 mt-1">Memverifikasi sesi guru...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900 flex antialiased">
      {/* ═══════════════════════════════════════════════════════════
          SIDEBAR
          ═══════════════════════════════════════════════════════════ */}
      <aside className="w-[260px] bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 hidden lg:flex">
        {/* Top */}
        <div>
          {/* Brand */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-[#0c4a6e] flex items-center justify-center">
              <FlaskConical className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="leading-none">
              <p className="text-[13px] font-bold text-slate-900 tracking-tight">Lab Kimia Virtual</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Panel Guru</p>
            </div>
          </div>

          {/* Nav */}
          <div className="px-3 pt-5 space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pb-2">Navigasi</p>

            <button
              onClick={() => playClick()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold bg-[#0c4a6e] text-white cursor-pointer transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 opacity-80" />
              Dashboard
            </button>

            <Link
              href="/lab"
              onClick={playClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
            >
              <Beaker className="w-4 h-4 text-slate-400" />
              Lab Siswa
              <ArrowUpRight className="w-3 h-3 ml-auto text-slate-300" />
            </Link>
          </div>
        </div>

        {/* Bottom: Profile + Logout */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          {/* Teacher card */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-100 shrink-0">
              <img src="/gambar/fatma.jpeg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {teacher?.nama || "Fatma Alawiyah, S.Pd., Gr."}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                NIP {teacher?.nip || "200103272025212017"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN AREA
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Lab Kimia</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-semibold">Dashboard</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm mx-auto sm:mx-0 sm:ml-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c4a6e]/15 focus:border-[#0c4a6e]/30 transition-all"
            />
          </div>

          {/* Profile (mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 sm:ml-4">
            <Link
              href="/lab"
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Beaker className="w-4 h-4" />
            </Link>
            <div className="sm:hidden w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-100">
              <img src="/gambar/fatma.jpeg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-100">
                <img src="/gambar/fatma.jpeg" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[160px]">
                  {teacher?.nama || "Fatma Alawiyah, S.Pd., Gr."}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">Guru Kimia</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                <Link href="/lab" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Beaker className="w-4 h-4 text-slate-400" />
                  Buka Lab Siswa
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── CONTENT ─── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Dashboard Praktikum
                </h1>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {currentDate}
                </p>
              </div>
              <button
                onClick={() => { playClick(); loadDashboardData(); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* ══════════════════════════════════════
                STAT CARDS
                ══════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  label: "Total Peserta",
                  value: metrics.total,
                  suffix: "siswa",
                  icon: Users,
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                  borderColor: "border-t-blue-500",
                },
                {
                  label: "Lulus KKM",
                  value: metrics.pass,
                  suffix: `dari ${metrics.total}`,
                  icon: CheckCircle2,
                  iconBg: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                  borderColor: "border-t-emerald-500",
                  badge: metrics.total > 0 ? `${metrics.passRate}%` : undefined,
                  badgeColor: "bg-emerald-50 text-emerald-700",
                },
                {
                  label: "Rata-rata Nilai",
                  value: metrics.avg,
                  suffix: "/ 100",
                  icon: Target,
                  iconBg: "bg-amber-50",
                  iconColor: "text-amber-600",
                  borderColor: "border-t-amber-500",
                  badge: metrics.avg > 0 ? `Grade ${getScoreGrade(metrics.avg)}` : undefined,
                  badgeColor: metrics.avg >= 75 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
                },
                {
                  label: "Rata-rata Durasi",
                  value: metrics.avgDur,
                  suffix: "menit",
                  icon: Timer,
                  iconBg: "bg-violet-50",
                  iconColor: "text-violet-600",
                  borderColor: "border-t-violet-500",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className={`bg-white rounded-xl border border-slate-200/80 border-t-2 ${card.borderColor} p-4 sm:p-5 hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                      <card.icon className={`w-[18px] h-[18px] ${card.iconColor}`} />
                    </div>
                    {card.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{card.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{card.value}</span>
                    <span className="text-xs text-slate-400 font-medium">{card.suffix}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ══════════════════════════════════════
                ANALYTICS ROW
                ══════════════════════════════════════ */}
            {students.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4"
              >
                {/* Grade Distribution */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      Distribusi Nilai
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                      <span>Tertinggi: <span className="text-emerald-600">{metrics.highest}</span></span>
                      <span className="text-slate-200">|</span>
                      <span>Terendah: <span className="text-rose-600">{metrics.lowest}</span></span>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { label: "A", range: "90 – 100", count: metrics.gradeA, color: "#10b981", bg: "#ecfdf5" },
                      { label: "B", range: "75 – 89", count: metrics.gradeB, color: "#0ea5e9", bg: "#f0f9ff" },
                      { label: "C", range: "60 – 74", count: metrics.gradeC, color: "#f59e0b", bg: "#fffbeb" },
                      { label: "D", range: "< 60", count: metrics.gradeD, color: "#ef4444", bg: "#fef2f2" },
                    ].map((g) => {
                      const pct = metrics.total > 0 ? (g.count / metrics.total) * 100 : 0;
                      return (
                        <div key={g.label} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 w-20 shrink-0">
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: g.color }}
                            >
                              {g.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{g.range}</span>
                          </div>
                          <div className="flex-1 h-6 rounded-md overflow-hidden relative" style={{ backgroundColor: g.bg }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(pct, 0)}%` }}
                              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                              className="h-full rounded-md"
                              style={{ backgroundColor: g.color, opacity: 0.85 }}
                            />
                          </div>
                          <div className="w-14 text-right shrink-0">
                            <span className="text-xs font-bold text-slate-700">{g.count}</span>
                            <span className="text-[10px] text-slate-400 ml-0.5">({Math.round(pct)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pass Rate Ring */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-slate-400" />
                    Tingkat Kelulusan
                  </h3>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    {/* SVG Ring */}
                    <div className="relative w-36 h-36 mb-4">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <motion.circle
                          cx="60" cy="60" r="48" fill="none"
                          stroke="#0c4a6e" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 48}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - metrics.passRate / 100) }}
                          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900 tabular-nums">{metrics.passRate}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Persen</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#0c4a6e]" />
                        <span className="text-slate-600">Lulus <span className="font-bold text-slate-900">{metrics.pass}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                        <span className="text-slate-600">Remidial <span className="font-bold text-slate-900">{metrics.fail}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════
                DATA TABLE
                ══════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden"
            >
              {/* Table Header */}
              <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0c4a6e] flex items-center justify-center">
                    <ClipboardList className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Rekap Data Siswa</h2>
                    <p className="text-[11px] text-slate-400">Tersinkronisasi realtime dari aktivitas praktikum</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Class Filter */}
                  <div className="relative">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 text-xs font-medium pl-3 pr-7 py-2 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0c4a6e]/15 cursor-pointer"
                    >
                      {["Semua", "X.1", "X.2", "X.3", "X.4", "X.5"].map((c) => (
                        <option key={c} value={c}>{c === "Semua" ? "Semua Kelas" : `Kelas ${c}`}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {/* Export */}
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0c4a6e] text-white text-xs font-semibold hover:bg-[#0a3d5c] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="py-3 px-5 sm:px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12">#</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nama Siswa</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kelas</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nilai</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Durasi</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tanggal</th>
                      <th className="py-3 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      /* Skeleton rows */
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skel-${i}`} className="border-t border-slate-50">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j} className="py-3.5 px-4">
                              <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: j === 1 ? "60%" : j === 3 ? "40%" : "50%" }} />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                              <Users className="w-6 h-6 text-slate-300" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-500">Belum Ada Data</p>
                              <p className="text-xs text-slate-400 mt-0.5">Data akan muncul setelah siswa menyelesaikan praktikum.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((s, idx) => {
                        const isPass = s.skor_kuis >= 75;
                        const sc = getScoreColor(s.skor_kuis);
                        return (
                          <tr key={s.id} className="border-t border-slate-100/80 hover:bg-slate-50/50 group transition-colors">
                            <td className="py-3 px-5 sm:px-6 text-xs text-slate-400 tabular-nums">{idx + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(s.nama)} flex items-center justify-center shrink-0`}>
                                  <span className="text-[10px] font-bold text-white">{getInitials(s.nama)}</span>
                                </div>
                                <span className="text-[13px] font-semibold text-slate-800">{s.nama}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-xs font-medium text-slate-500">{s.kelas}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className={`text-[13px] font-bold tabular-nums ${sc.text}`}>{s.skor_kuis}</span>
                                {/* Mini progress bar */}
                                <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className={`h-full rounded-full ${sc.bg}`}
                                    style={{ width: `${s.skor_kuis}%`, transition: "width 0.5s ease" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {isPass ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Lulus
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                                  <AlertCircle className="w-3 h-3" />
                                  Remidial
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-500 tabular-nums">{s.durasi_menit} mnt</td>
                            <td className="py-3 px-4 text-xs text-slate-400">
                              {new Date(s.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleOpenDetail(s)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-[#0c4a6e] bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Detail
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(s)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

              {/* Table Footer */}
              {!loading && students.length > 0 && (
                <div className="px-5 sm:px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Menampilkan {students.length} siswa</span>
                  <span>Diperbarui {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              )}
            </motion.div>

          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: DETAIL SISWA
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeStudent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setActiveStudent(null)} />
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/60"
            >
              {/* Header */}
              <div className="bg-[#0c4a6e] text-white px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center font-bold text-sm backdrop-blur-sm`}>
                    {getInitials(activeStudent.nama)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{activeStudent.nama}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-sky-200">
                      <span>{activeStudent.kelas}</span>
                      <span className="opacity-40">·</span>
                      <span className={`font-bold ${activeStudent.skor_kuis >= 75 ? "text-emerald-300" : "text-rose-300"}`}>
                        Nilai {activeStudent.skor_kuis}/100
                      </span>
                      <span className="opacity-40">·</span>
                      <span>{activeStudent.durasi_menit} mnt</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* PBL Worksheet */}
                <section>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-[#0c4a6e]" />
                    Lembar Kerja Problem-Based Learning
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { label: "Penyebab Masalah", value: activeStudent.lembar_kerja?.penyebab },
                      { label: "Dampak yang Ditimbulkan", value: activeStudent.lembar_kerja?.dampak },
                      { label: "Solusi & Prosedur Benar", value: activeStudent.lembar_kerja?.solusi },
                      { label: "Langkah Pencegahan", value: activeStudent.lembar_kerja?.pencegahan },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{item.value || <span className="italic text-slate-400">Belum diisi</span>}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Refleksi */}
                <section className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Jurnal Refleksi Pembelajaran
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Hal Baru yang Dipelajari", value: activeStudent.refleksi?.hal_baru },
                      { label: "Hal yang Paling Menarik", value: activeStudent.refleksi?.hal_menarik },
                      { label: "Yang Belum Dipahami", value: activeStudent.refleksi?.belum_paham },
                      { label: "Penerapan dalam Kehidupan", value: activeStudent.refleksi?.penerapan },
                      { label: "Kesan terhadap Praktikum", value: activeStudent.refleksi?.kesan },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{item.label}</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{item.value || <span className="italic text-slate-400">Belum diisi</span>}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pemahaman */}
                  <div className="mt-3 bg-amber-50/80 p-3.5 rounded-lg border border-amber-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Skala Pemahaman
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-5 h-5" viewBox="0 0 20 20" fill={s <= (activeStudent.refleksi?.skala_pemahaman || 0) ? "#f59e0b" : "#e2e8f0"}>
                          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.28l-4.77 2.51.91-5.33L2.27 6.62l5.34-.78L10 1z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-bold text-amber-700 tabular-nums">{activeStudent.refleksi?.skala_pemahaman || 0}/5</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveStudent(null)}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          DELETE MODAL
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-xl p-6 max-w-sm w-full z-10 text-center space-y-4 shadow-xl border border-slate-200/60"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Data Siswa?</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Data <strong className="text-slate-700">{deleteTarget.nama}</strong> akan dihapus permanen dari database.
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-lg bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 active:scale-[0.98] transition-all cursor-pointer"
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
