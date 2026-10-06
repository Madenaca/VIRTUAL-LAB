"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/useAppStore";
import { useLabAuth } from "@/lib/useLabAuth";
import { useClickSound } from "@/lib/useSound";
import {
  Gamepad2,
  Heart,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Sparkles,
  Droplets,
  Flame,
  Award,
} from "lucide-react";

export default function LabGamePage() {
  const router = useRouter();
  const { isAuthorized, isChecking } = useLabAuth();
  const { nama, setSkor, skor } = useAppStore();
  const playClick = useClickSound();

  // Game Global State
  const [stage, setStage] = useState<1 | 2 | 3 | "win" | "over">(1);
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Stage 1 State (APD Challenge)
  const apdOptions = [
    { id: "jas", name: "Jas Lab Lengan Panjang", correct: true, icon: "🥼" },
    { id: "kacamata", name: "Kacamata Safety (Goggles)", correct: true, icon: "🥽" },
    { id: "sandal", name: "Sandal Jepit Santai", correct: false, icon: "🩴", trap: "Bahaya! Kaki rentan terkena tumpahan zat korosif." },
    { id: "sarung", name: "Sarung Tangan Nitril", correct: true, icon: "🧤" },
    { id: "makanan", name: "Minuman Botol / Makanan", correct: false, icon: "🥤", trap: "Dilarang makan & minum di laboratorium!" },
    { id: "sepatu", name: "Sepatu Tertutup Kulit", correct: true, icon: "👞" },
  ];
  const [selectedApd, setSelectedApd] = useState<string[]>([]);

  // Stage 2 State (Apparatus Detective)
  const [appQuestionIdx, setAppQuestionIdx] = useState(0);
  const apparatusQuestions = [
    {
      question: "Tugas 1: Kamu diminta mengambil tepat 10,00 mL larutan HCl untuk analisis kuantitatif berpresisi tinggi.",
      options: [
        { name: "Gelas Beker 100 mL", correct: false, reason: "Gelas beker memiliki skala kasar, bukan alat ukur presisi." },
        { name: "Pipet Volume 10 mL", correct: true, reason: "Tepat! Pipet volume (gondok) dirancang untuk volume presisi tinggi dengan 1 batas ukur." },
        { name: "Tabung Reaksi", correct: false, reason: "Tabung reaksi hanya wadah reaksi kualitatif, tanpa skala volume." },
        { name: "Sendok Spatula", correct: false, reason: "Spatula hanya untuk mengambil zat padat / serbuk." },
      ],
    },
    {
      question: "Tugas 2: Wadah mana yang paling aman untuk proses titrasi larutan agar tidak mudah tumpah saat dikocok memutar?",
      options: [
        { name: "Labu Erlenmeyer", correct: true, reason: "Benar! Bentuk kerucut leher sempit memudahkan pengadukan melingkar tanpa tumpah." },
        { name: "Gelas Ukur", correct: false, reason: "Gelas ukur tinggi dan mudah roboh saat diaduk memutar." },
        { name: "Cawan Penguap", correct: false, reason: "Cawan penguap dangkal dan sangat mudah tumpah." },
        { name: "Corong Kaca", correct: false, reason: "Corong untuk menyaring/menuang, bukan tempat menampung titrasi." },
      ],
    },
    {
      question: "Tugas 3: Alat apa yang wajib diletakkan di atas kaki tiga saat memanaskan gelas beker di atas Bunsen agar panas merata?",
      options: [
        { name: "Kasa Kawat Asbes", correct: true, reason: "Tepat! Kasa kawat meratakan distribusi panas dan mencegah dasar gelas pecah." },
        { name: "Kertas Saring", correct: false, reason: "Bahaya! Kertas saring mudah terbakar oleh api Bunsen." },
        { name: "Penjepit Kayu", correct: false, reason: "Penjepit kayu hanya untuk tabung reaksi kecil." },
        { name: "Kaca Arloji", correct: false, reason: "Kaca arloji penutup wadah, bukan penyangga panas." },
      ],
    },
  ];

  // Stage 3 State (Reaction & Titration Simulator)
  const [drops, setDrops] = useState(0);
  const [isStirring, setIsStirring] = useState(false);
  const targetDrops = 7; // Exact equivalence point

  const calculatePH = (dropCount: number) => {
    if (dropCount === 0) return 1.0;
    if (dropCount < 4) return Number((1.0 + dropCount * 0.8).toFixed(1));
    if (dropCount < 7) return Number((3.5 + (dropCount - 4) * 1.0).toFixed(1));
    if (dropCount === 7) return 7.8; // Equivalence point with phenolphthalein
    if (dropCount <= 9) return Number((9.5 + (dropCount - 7) * 1.2).toFixed(1));
    return 12.5;
  };

  const currentPH = calculatePH(drops);

  const getLiquidColor = (dropCount: number) => {
    if (dropCount < 6) return "rgba(224, 242, 254, 0.4)"; // Clear / water-like
    if (dropCount === 6) return "rgba(251, 207, 232, 0.5)"; // Very faint pink
    if (dropCount === 7) return "rgba(244, 114, 182, 0.85)"; // Perfect light pink
    if (dropCount === 8) return "rgba(219, 39, 119, 0.95)"; // Over-titrated magenta
    return "rgba(157, 23, 77, 1)"; // Dark purple over-titration
  };

  // Check life deduction
  const reduceLife = (msg: string) => {
    setFeedback({ type: "error", text: msg });
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setStage("over"), 1200);
      }
      return next;
    });
  };

  // Stage 1: APD Selection Handler
  const handleToggleApd = (item: typeof apdOptions[0]) => {
    playClick();
    if (selectedApd.includes(item.id)) {
      setSelectedApd(selectedApd.filter((id) => id !== item.id));
    } else {
      if (!item.correct) {
        reduceLife(item.trap || "Item tersebut tidak sesuai standar APD laboratorium!");
        return;
      }
      const next = [...selectedApd, item.id];
      setSelectedApd(next);
      setPoints((p) => p + 15);

      if (next.length === 4) {
        setFeedback({ type: "success", text: "Luar biasa! 4 APD wajib terpasang sempurna. Siap menuju Stage 2!" });
        setTimeout(() => {
          setFeedback(null);
          setStage(2);
        }, 1500);
      }
    }
  };

  // Stage 2: Apparatus Handler
  const handleAnswerApparatus = (opt: { name: string; correct: boolean; reason: string }) => {
    playClick();
    if (opt.correct) {
      setPoints((p) => p + 25);
      setFeedback({ type: "success", text: opt.reason });
      setTimeout(() => {
        setFeedback(null);
        if (appQuestionIdx < apparatusQuestions.length - 1) {
          setAppQuestionIdx((prev) => prev + 1);
        } else {
          setStage(3);
        }
      }, 1600);
    } else {
      reduceLife(opt.reason);
    }
  };

  // Stage 3: Titration Dropper Handler
  const handleAddDrop = () => {
    playClick();
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 500);

    const nextDrops = drops + 1;
    setDrops(nextDrops);

    if (nextDrops > targetDrops + 2) {
      reduceLife("Larutan sudah lewat jenuh (over-titrated)! Warna terlalu ungu tua.");
    }
  };

  const handleFinishTitration = () => {
    playClick();
    if (drops === targetDrops) {
      setPoints((p) => p + 50);
      setFeedback({
        type: "success",
        text: "Sempurna! Titik akhir titrasi tercapai pada warna merah muda lembut (pH 7.8 - 8.2).",
      });
      setTimeout(() => setStage("win"), 1800);
    } else if (drops === targetDrops - 1 || drops === targetDrops + 1) {
      setPoints((p) => p + 30);
      setFeedback({
        type: "success",
        text: "Bagus! Mendekati titik ekivalen sempurna.",
      });
      setTimeout(() => setStage("win"), 1800);
    } else if (drops < targetDrops - 1) {
      reduceLife("Larutan masih bersifat asam dan belum mencapai titik ekivalen (belum ada perubahan warna).");
    } else {
      reduceLife("Larutan kelebihan basa berlebih (over-titrated).");
    }
  };

  const handleRestartGame = () => {
    playClick();
    setStage(1);
    setLives(3);
    setPoints(0);
    setSelectedApd([]);
    setAppQuestionIdx(0);
    setDrops(0);
    setFeedback(null);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 text-sm font-medium">Memverifikasi akses laboratorium...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <p className="text-slate-700 font-medium">Kamu belum login ke laboratorium.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { playClick(); router.push("/"); }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Masuk sebagai Siswa
            </button>
            <button
              onClick={() => { playClick(); router.push("/admin/login"); }}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Portal Guru / Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lab-pattern pb-20 pt-6 sm:pt-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Game Navigation & Status Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">
                Simulasi Game Lab
              </h1>
              <p className="text-[11px] text-cyan-300">
                Stage {stage === "win" || stage === "over" ? "Final" : stage} dari 3
              </p>
            </div>
          </div>

          {/* Lives & Score */}
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              {[1, 2, 3].map((i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i <= lives ? "text-red-500 fill-red-500" : "text-slate-600"
                  }`}
                />
              ))}
            </div>

            {/* Points */}
            <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 text-yellow-400 font-extrabold text-sm">
              <Trophy className="w-4 h-4" />
              <span>{points}</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border flex items-center gap-3 shadow-lg ${
                feedback.type === "success"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {feedback.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================
            STAGE 1: APD SCANNER CHALLENGE
            ============================================================ */}
        {stage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Stage 1: Inspeksi APD
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Pilih 4 Alat Pelindung Diri (APD) Wajib
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sebelum masuk ke area uji asam nitrat, pilih 4 perlengkapan keselamatan yang wajib kamu kenakan dan hindari barang terlarang!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {apdOptions.map((item) => {
                const isSelected = selectedApd.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleApd(item)}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-3 transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? "border-green-500 bg-green-50/80 shadow-md"
                        : "border-slate-200 bg-slate-50 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {isSelected ? "Terpasang ✓" : "Klik untuk pasang"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Progres APD: {selectedApd.length} / 4 Terpasang</span>
              <span className="text-blue-600 font-semibold">Tiap item benar = +15 Poin</span>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            STAGE 2: APPARATUS DETECTIVE
            ============================================================ */}
        {stage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                <FlaskConical className="w-3.5 h-3.5" /> Stage 2: Alat Detective
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Pilih Alat Praktikum yang Tepat
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Soal {appQuestionIdx + 1} dari {apparatusQuestions.length}
              </p>
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-inner space-y-2">
              <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                Instruksi Guru Kimia:
              </p>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {apparatusQuestions[appQuestionIdx].question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {apparatusQuestions[appQuestionIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerApparatus(opt)}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-orange-400 text-left transition-all active:scale-95 cursor-pointer shadow-sm group"
                >
                  <p className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                    {opt.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pilih alat ini untuk misi
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================================================
            STAGE 3: VIRTUAL REACTION & TITRATION SIMULATOR
            ============================================================ */}
        {stage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Stage 3: Titrasi & Reaksi Virtual
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Tentukan Titik Akhir Titrasi Asam-Basa
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Labu Erlenmeyer berisi <strong>HCl + Indikator PP</strong>. Teteskan <strong>NaOH</strong> dari buret secara bertahap sampai larutan berubah menjadi <strong>merah muda lembut</strong> (titik ekivalen)! Jangan sampai berlebih (ungu pekat).
              </p>
            </div>

            {/* Virtual Simulation Glassware Graphic */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              
              {/* Buret Dropper Tip */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-28 bg-slate-800/80 border-2 border-slate-600 rounded-b-lg relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-cyan-400/80 transition-all duration-300 rounded-b" style={{ height: `${Math.max(10, 100 - drops * 10)}%` }} />
                </div>
                <div className="w-2 h-4 bg-slate-600" />
                
                {/* Droplet Animation */}
                <motion.div
                  key={drops}
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: 35, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4 }}
                  className="w-3 h-3 rounded-full bg-cyan-400"
                />
              </div>

              {/* Erlenmeyer Flask with dynamic chemical liquid */}
              <div className="relative flex flex-col items-center">
                {/* Erlenmeyer Flask Container SVG */}
                <div className={`relative w-44 h-48 transition-transform ${isStirring ? "rotate-2" : "rotate-0"}`}>
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
                    {/* Glass Body Outline */}
                    <path
                      d="M 40 10 L 40 35 L 12 105 A 8 8 0 0 0 18 115 L 82 115 A 8 8 0 0 0 88 105 L 60 35 L 60 10 Z"
                      fill="rgba(255, 255, 255, 0.08)"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                    />

                    {/* Dynamic Liquid */}
                    <path
                      d="M 22 95 L 30 70 Q 50 68 70 70 L 78 95 A 6 6 0 0 1 73 112 L 27 112 A 6 6 0 0 1 22 95 Z"
                      fill={getLiquidColor(drops)}
                      className="transition-colors duration-500"
                    />

                    {/* Graduation Marks */}
                    <line x1="45" y1="80" x2="55" y2="80" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                    <line x1="42" y1="90" x2="58" y2="90" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                    <line x1="38" y1="100" x2="62" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  pH Larutan: <span className="font-bold text-cyan-300">{currentPH}</span>
                </p>
              </div>

              {/* Control Panel */}
              <div className="space-y-3 w-full sm:w-48 text-center sm:text-left">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">Jumlah Tetes NaOH:</p>
                  <p className="text-2xl font-extrabold text-cyan-400">{drops} Tetes</p>
                  <p className="text-[10px] text-slate-400">
                    Target: Titik ekivalen tepat
                  </p>
                </div>

                <button
                  onClick={handleAddDrop}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Droplets className="w-4 h-4" />
                  +1 Tetes NaOH
                </button>

                <button
                  onClick={handleFinishTitration}
                  className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Kunci Titik Akhir
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ============================================================
            GAME WON SCREEN
            ============================================================ */}
        {stage === "win" && (
          <motion.div
            key="win"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-green-200 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Selamat, {nama}! 🎉
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Kamu telah menyelesaikan semua misi simulasi game laboratorium kimia dengan sangat baik. Pemahamanmu tentang keselamatan kerja dan prosedur lab sudah teruji!
              </p>
            </div>

            <div className="inline-flex items-center gap-6 px-8 py-3 rounded-2xl bg-amber-50 border border-amber-200">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Total Skor Game</span>
                <span className="text-3xl font-black text-amber-600">{points}</span>
              </div>
              <div className="h-8 w-px bg-amber-200" />
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Sisa Nyawa</span>
                <span className="text-lg font-bold text-red-500">❤️ {lives} / 3</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                onClick={handleRestartGame}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Main Ulang
              </button>

              <button
                onClick={() => {
                  playClick();
                  router.push("/kuis");
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Lanjut ke Kuis Evaluasi
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            GAME OVER SCREEN
            ============================================================ */}
        {stage === "over" && (
          <motion.div
            key="over"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-200 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Nyawa Habis! ⚠️
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Terjadi pelanggaran keselamatan atau kesalahan prosedur dalam praktikum. Ingat, keselamatan kerja di laboratorium kimia adalah prioritas nomor satu!
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-sm mx-auto">
              Skor yang kamu kumpulkan: <strong className="text-slate-900">{points} Poin</strong>. Coba lagi dan raih skor sempurna!
            </div>

            <div className="pt-2">
              <button
                onClick={handleRestartGame}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Lagi dari Awal
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
