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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isTeacherAuth(req)) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Silakan login." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const studentId = Number(id);

  try {
    const mysqlReady = await initDatabase();

    if (mysqlReady) {
      try {
        const pool = getPool();

        // 1. Get student basic info
        const [studentRows]: any = await pool.query(
          "SELECT * FROM siswa WHERE id = ? LIMIT 1",
          [studentId]
        );

        if (!studentRows || studentRows.length === 0) {
          return NextResponse.json(
            { success: false, message: "Siswa tidak ditemukan" },
            { status: 404 }
          );
        }

        const student = studentRows[0];

        // 2. Get worksheet
        const [worksheetRows]: any = await pool.query(
          "SELECT * FROM lembar_kerja_siswa WHERE siswa_id = ? LIMIT 1",
          [studentId]
        );

        // 3. Get quiz answers
        const [quizRows]: any = await pool.query(
          "SELECT * FROM jawaban_kuis_siswa WHERE siswa_id = ? ORDER BY soal_id ASC",
          [studentId]
        );

        // 4. Get reflections
        const [reflectionRows]: any = await pool.query(
          "SELECT * FROM refleksi_siswa WHERE siswa_id = ? LIMIT 1",
          [studentId]
        );

        return NextResponse.json({
          success: true,
          student: {
            ...student,
            lembar_kerja: worksheetRows[0] || null,
            jawaban_kuis: quizRows || [],
            refleksi: reflectionRows[0] || null,
          },
        });
      } catch (err) {
        console.warn("MySQL student detail error, fallback to memory:", err);
      }
    }

    // Memory fallback
    const student = inMemoryStore.siswa.find((s) => s.id === studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student detail error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat detail siswa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isTeacherAuth(req)) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const studentId = Number(id);

  try {
    const mysqlReady = await initDatabase();
    if (mysqlReady) {
      try {
        const pool = getPool();
        await pool.query("DELETE FROM siswa WHERE id = ?", [studentId]);
        return NextResponse.json({
          success: true,
          message: "Data siswa berhasil dihapus",
        });
      } catch (err) {
        console.warn("MySQL delete error, fallback to memory:", err);
      }
    }

    const index = inMemoryStore.siswa.findIndex((s) => s.id === studentId);
    if (index >= 0) {
      inMemoryStore.siswa.splice(index, 1);
    }

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data siswa" },
      { status: 500 }
    );
  }
}
