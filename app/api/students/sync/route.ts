import { NextRequest, NextResponse } from "next/server";
import { getPool, inMemoryStore, initDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      sessionId,
      nama,
      kelas,
      skorKuis = 0,
      durasiMenit = 0,
      statusSelesai = 0,
      lembarKerja,
      jawabanKuis,
      refleksi,
    } = data;

    if (!sessionId || !nama || !kelas) {
      return NextResponse.json(
        { success: false, message: "SessionId, nama, dan kelas wajib diisi" },
        { status: 400 }
      );
    }

    const mysqlReady = await initDatabase();

    if (mysqlReady) {
      try {
        const pool = getPool();

        // 1. Upsert siswa
        await pool.query(
          `INSERT INTO siswa (session_id, nama, kelas, skor_kuis, durasi_menit, status_selesai)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             nama = VALUES(nama),
             kelas = VALUES(kelas),
             skor_kuis = VALUES(skor_kuis),
             durasi_menit = VALUES(durasi_menit),
             status_selesai = VALUES(status_selesai)`,
          [sessionId, nama, kelas, skorKuis, durasiMenit, statusSelesai ? 1 : 0]
        );

        // Get student id
        const [rows]: any = await pool.query(
          "SELECT id FROM siswa WHERE session_id = ? LIMIT 1",
          [sessionId]
        );
        const studentId = rows[0]?.id;

        if (studentId) {
          // 2. Upsert lembar kerja
          if (lembarKerja) {
            await pool.query(
              `INSERT INTO lembar_kerja_siswa (siswa_id, penyebab, dampak, solusi, pencegahan)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 penyebab = VALUES(penyebab),
                 dampak = VALUES(dampak),
                 solusi = VALUES(solusi),
                 pencegahan = VALUES(pencegahan)`,
              [
                studentId,
                lembarKerja.penyebab || "",
                lembarKerja.dampak || "",
                lembarKerja.solusi || "",
                lembarKerja.pencegahan || "",
              ]
            );
          }

          // 3. Insert / update jawaban kuis
          if (Array.isArray(jawabanKuis) && jawabanKuis.length > 0) {
            // Clear previous answers for this session
            await pool.query("DELETE FROM jawaban_kuis_siswa WHERE siswa_id = ?", [studentId]);
            for (const j of jawabanKuis) {
              await pool.query(
                `INSERT INTO jawaban_kuis_siswa (siswa_id, soal_id, pilihan_siswa, is_benar)
                 VALUES (?, ?, ?, ?)`,
                [studentId, j.soalId, j.pilihan, j.benar ? 1 : 0]
              );
            }
          }

          // 4. Upsert refleksi
          if (refleksi) {
            await pool.query("DELETE FROM refleksi_siswa WHERE siswa_id = ?", [studentId]);
            await pool.query(
              `INSERT INTO refleksi_siswa (siswa_id, hal_baru, hal_menarik, belum_paham, penerapan, kesan, skala_pemahaman)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                studentId,
                refleksi["hal-baru"] || refleksi.halBaru || "",
                refleksi["hal-menarik"] || refleksi.halMenarik || "",
                refleksi["belum-paham"] || refleksi.belumPaham || "",
                refleksi["penerapan"] || refleksi.penerapan || "",
                refleksi["kesan"] || refleksi.kesan || "",
                Number(refleksi["skala-pemahaman"] || refleksi.skalaPemahaman) || 0,
              ]
            );
          }
        }

        return NextResponse.json({
          success: true,
          message: "Data siswa berhasil disinkronkan ke MySQL",
          studentId,
        });
      } catch (dbErr) {
        console.warn("MySQL sync error, using memory fallback:", dbErr);
      }
    }

    // Fallback in-memory sync
    const existingIndex = inMemoryStore.siswa.findIndex((s) => s.session_id === sessionId);
    const updatedRecord = {
      id: existingIndex >= 0 ? inMemoryStore.siswa[existingIndex].id : inMemoryStore.siswa.length + 1,
      session_id: sessionId,
      nama,
      kelas,
      skor_kuis: skorKuis,
      durasi_menit: durasiMenit,
      status_selesai: statusSelesai ? 1 : 0,
      created_at: existingIndex >= 0 ? inMemoryStore.siswa[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lembar_kerja: lembarKerja || inMemoryStore.siswa[existingIndex]?.lembar_kerja,
      jawaban_kuis: (jawabanKuis || []).map((j: any) => ({
        soal_id: j.soalId,
        pilihan_siswa: j.pilihan,
        is_benar: j.benar ? 1 : 0,
      })),
      refleksi: {
        hal_baru: refleksi?.["hal-baru"] || refleksi?.halBaru || "",
        hal_menarik: refleksi?.["hal-menarik"] || refleksi?.halMenarik || "",
        belum_paham: refleksi?.["belum-paham"] || refleksi?.belumPaham || "",
        penerapan: refleksi?.["penerapan"] || refleksi?.penerapan || "",
        kesan: refleksi?.["kesan"] || refleksi?.kesan || "",
        skala_pemahaman: Number(refleksi?.["skala-pemahaman"] || refleksi?.skalaPemahaman) || 0,
      },
    };

    if (existingIndex >= 0) {
      inMemoryStore.siswa[existingIndex] = updatedRecord;
    } else {
      inMemoryStore.siswa.push(updatedRecord);
    }

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil disimpan",
      studentId: updatedRecord.id,
    });
  } catch (error) {
    console.error("Student sync error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyinkronkan data siswa" },
      { status: 500 }
    );
  }
}
