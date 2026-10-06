"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface JawabanKuis {
  soalId: number;
  pilihan: number;
  benar: boolean;
}

export interface LembarKerja {
  penyebab: string;
  dampak: string;
  solusi: string;
  pencegahan: string;
}

interface AppState {
  sessionId: string;
  nama: string;
  kelas: string;
  sudahLogin: boolean;
  skor: number;
  jawabanKuis: JawabanKuis[];
  lembarKerja: LembarKerja;
  refleksi: Record<string, string>;
  waktuMulai: number | null;
  statusSelesai: boolean;

  setNama: (nama: string) => void;
  setKelas: (kelas: string) => void;
  setSudahLogin: (val: boolean) => void;
  setSkor: (skor: number) => void;
  setJawabanKuis: (j: JawabanKuis[]) => void;
  setLembarKerja: (lk: Partial<LembarKerja>) => void;
  setRefleksi: (key: string, value: string) => void;
  setWaktuMulai: (t: number) => void;
  setStatusSelesai: (s: boolean) => void;
  syncWithBackend: (completed?: boolean) => Promise<boolean>;
  reset: () => void;
}

function generateSessionId() {
  return `siswa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      nama: "",
      kelas: "",
      sudahLogin: false,
      skor: 0,
      jawabanKuis: [],
      lembarKerja: {
        penyebab: "",
        dampak: "",
        solusi: "",
        pencegahan: "",
      },
      refleksi: {},
      waktuMulai: null,
      statusSelesai: false,

      setNama: (nama) => set({ nama }),
      setKelas: (kelas) => set({ kelas }),
      setSudahLogin: (val) => {
        set({ sudahLogin: val });
        if (val) {
          get().syncWithBackend(false);
        }
      },
      setSkor: (skor) => {
        set({ skor });
        get().syncWithBackend();
      },
      setJawabanKuis: (j) => {
        set({ jawabanKuis: j });
        get().syncWithBackend();
      },
      setLembarKerja: (lk) => {
        set((s) => ({
          lembarKerja: { ...s.lembarKerja, ...lk },
        }));
        get().syncWithBackend();
      },
      setRefleksi: (key, value) => {
        set((s) => ({ refleksi: { ...s.refleksi, [key]: value } }));
        get().syncWithBackend();
      },
      setWaktuMulai: (t) => set({ waktuMulai: t }),
      setStatusSelesai: (s) => {
        set({ statusSelesai: s });
        get().syncWithBackend(s);
      },

      syncWithBackend: async (completed?: boolean) => {
        const state = get();
        if (!state.nama || !state.kelas) return false;

        const durasi = state.waktuMulai
          ? Math.max(1, Math.round((Date.now() - state.waktuMulai) / 60000))
          : 0;

        const isSelesai = completed !== undefined ? completed : state.statusSelesai;

        try {
          const res = await fetch("/api/students/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: state.sessionId,
              nama: state.nama,
              kelas: state.kelas,
              skorKuis: state.skor,
              durasiMenit: durasi,
              statusSelesai: isSelesai ? 1 : 0,
              lembarKerja: state.lembarKerja,
              jawabanKuis: state.jawabanKuis,
              refleksi: state.refleksi,
            }),
          });
          return res.ok;
        } catch {
          // Network offline / background fallback
          return false;
        }
      },

      reset: () =>
        set({
          sessionId: generateSessionId(),
          nama: "",
          kelas: "",
          sudahLogin: false,
          skor: 0,
          jawabanKuis: [],
          lembarKerja: {
            penyebab: "",
            dampak: "",
            solusi: "",
            pencegahan: "",
          },
          refleksi: {},
          waktuMulai: null,
          statusSelesai: false,
        }),
    }),
    { name: "lab-kimia-store" }
  )
);
