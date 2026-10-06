import { NextRequest, NextResponse } from "next/server";
import { getPool, inMemoryStore, initDatabase } from "@/lib/db";

function isTeacherAuth(req: NextRequest) {
  const cookie = req.cookies.get("teacher_session");
  if (!cookie || !cookie.value) return false;
  try {
    const decoded = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf-8"));
    return Boolean(decoded && decoded.username);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isTeacherAuth(req)) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak" },
      { status: 401 }
    );
  }

  try {
    const mysqlReady = await initDatabase();
    let students: any[] = [];

    if (mysqlReady) {
      try {
        const pool = getPool();
        const [rows]: any = await pool.query(
          "SELECT id, nama, kelas, skor_kuis, durasi_menit, status_selesai, created_at, updated_at FROM siswa"
        );
        students = rows || [];
      } catch (err) {
        console.warn("MySQL stats query error, using memory fallback:", err);
      }
    }

    if (students.length === 0 && inMemoryStore.siswa.length > 0) {
      students = inMemoryStore.siswa;
    }

    const totalStudents = students.length;
    const completedStudents = students.filter((s) => s.status_selesai === 1).length;
    const totalScore = students.reduce((acc, s) => acc + (Number(s.skor_kuis) || 0), 0);
    const averageScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
    const passCount = students.filter((s) => (Number(s.skor_kuis) || 0) >= 75).length;
    const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

    // Class distribution
    const classDistribution: Record<string, number> = {};
    students.forEach((s) => {
      const k = s.kelas || "Lainnya";
      classDistribution[k] = (classDistribution[k] || 0) + 1;
    });

    // Score ranges
    const scoreRanges = {
      sangatBaik: students.filter((s) => Number(s.skor_kuis) >= 90).length, // 90-100
      baik: students.filter((s) => Number(s.skor_kuis) >= 75 && Number(s.skor_kuis) < 90).length, // 75-89
      cukup: students.filter((s) => Number(s.skor_kuis) >= 60 && Number(s.skor_kuis) < 75).length, // 60-74
      perluBelajar: students.filter((s) => Number(s.skor_kuis) < 60).length, // <60
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        completedStudents,
        averageScore,
        passCount,
        passRate,
        classDistribution,
        scoreRanges,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
