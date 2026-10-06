"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const apdItems = [
  { id: "jas", label: "Jas Lab", emoji: "🥼", desc: "Melindungi pakaian & kulit dari percikan bahan kimia" },
  { id: "kacamata", label: "Kacamata Pelindung", emoji: "🥽", desc: "Melindungi mata dari percikan & uap bahan kimia" },
  { id: "sarung-tangan", label: "Sarung Tangan", emoji: "🧤", desc: "Melindungi tangan dari bahan kimia korosif & berbahaya" },
  { id: "masker", label: "Masker", emoji: "😷", desc: "Melindungi pernapasan dari uap & debu bahan kimia" },
  { id: "sepatu", label: "Sepatu Tertutup", emoji: "👟", desc: "Melindungi kaki dari tumpahan bahan kimia" },
];

const rules = [
  "Selalu kenakan APD lengkap selama berada di laboratorium",
  "Dilarang makan, minum, dan merokok di laboratorium",
  "Baca label bahan kimia sebelum digunakan",
  "Laporkan kecelakaan kepada guru segera",
  "Buang limbah kimia pada tempat yang telah disediakan",
];

interface APDAnimationProps {
  onComplete: () => void;
}

export default function APDAnimation({ onComplete }: APDAnimationProps) {
  const [step, setStep] = useState(0);
  const [checkedRules, setCheckedRules] = useState<boolean[]>(Array(rules.length).fill(false));
  const [allChecked, setAllChecked] = useState(false);
  const [apdDone, setApdDone] = useState(false);

  useEffect(() => {
    if (step < apdItems.length) {
      const timer = setTimeout(() => setStep((s) => s + 1), 900);
      return () => clearTimeout(timer);
    } else {
      setApdDone(true);
    }
  }, [step]);

  useEffect(() => {
    setAllChecked(checkedRules.every(Boolean));
  }, [checkedRules]);

  const toggleRule = (i: number) => {
    setCheckedRules((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Character + APD display */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-48 h-56 flex flex-col items-center justify-end bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-300 shadow-inner overflow-hidden">
          {/* Body silhouette */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-20">
            <div className="w-10 h-10 rounded-full bg-slate-600" />
            <div className="w-20 h-28 bg-slate-600 rounded-t-xl" />
          </div>

          {/* APD layers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pt-2">
            {/* Head */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span className="text-4xl">🧑</span>
              {/* Kacamata */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 text-xl"
                  >
                    🥽
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Masker */}
              <AnimatePresence>
                {step >= 4 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg"
                  >
                    😷
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Body area */}
            <div className="relative w-24 h-28 flex items-center justify-center">
              {/* Jas lab */}
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    style={{ originY: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-6xl">🥼</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Sarung tangan */}
              <AnimatePresence>
                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -left-3 top-8 text-2xl"
                  >
                    🧤
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -right-3 top-8 text-2xl"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    🧤
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feet */}
            <div className="flex gap-3">
              <AnimatePresence>
                {step >= 5 ? (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl"
                  >
                    👟
                  </motion.span>
                ) : (
                  <span className="text-2xl opacity-30">🦶</span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {step >= 5 ? (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl scale-x-[-1]"
                  >
                    👟
                  </motion.span>
                ) : (
                  <span className="text-2xl opacity-30">🦶</span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* APD Checklist */}
        <div className="w-full max-w-sm space-y-2">
          {apdItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={step > i ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -10 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
                step > i
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs opacity-75">{item.desc}</p>
              </div>
              {step > i && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Safety Rules Checklist */}
      <AnimatePresence>
        {apdDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="font-bold text-slate-700 text-center text-sm uppercase tracking-wider">
              ✅ Centang Peraturan Keselamatan
            </h3>
            <div className="space-y-2">
              {rules.map((rule, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => toggleRule(i)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    checkedRules[i]
                      ? "bg-blue-50 border-blue-400 text-blue-800"
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {checkedRules[i] ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <span className="text-sm">{rule}</span>
                </motion.button>
              ))}
            </div>

            {/* Enter lab button */}
            <AnimatePresence>
              {allChecked && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={onComplete}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center justify-center gap-3"
                >
                  <span>🔬</span>
                  Masuk ke Laboratorium
                  <span>➜</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
