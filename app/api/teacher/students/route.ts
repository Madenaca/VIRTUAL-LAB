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
      { success: false, message: "Akses ditolak. Silakan login sebagai guru." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const kelas = searchParams.get("kelas") || "";

  try {
    const mysqlReady = await initDatabase();

    if (mysqlReady) {
      try {
        const pool = getPool();
        let sql = `
          SELECT id, session_id, nama, kelas, skor_kuis, durasi_menit, status_selesai, created_at, updated_at
          FROM siswa
          WHERE 1=1
        `;
        const params: any[] = [];

        if (q) {
          sql += " AND LOWER(nama) LIKE ?";
          params.push(`%${q}%`);
        }
        if (kelas && kelas !== "Semua") {
          sql += " AND kelas = ?";
          params.push(kelas);
        }

        sql += " ORDER BY updated_at DESC, id DESC";

        const [rows]: any = await pool.query(sql, params);
        return NextResponse.json({
          success: true,
          students: rows || [],
        });
      } catch (err) {
        console.warn("MySQL students query error, using memory fallback:", err);
      }
    }

    // Memory store fallback
    let filtered = [...inMemoryStore.siswa];
    if (q) {
      filtered = filtered.filter((s) => s.nama.toLowerCase().includes(q));
    }
    if (kelas && kelas !== "Semua") {
      filtered = filtered.filter((s) => s.kelas === kelas);
    }
    filtered.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return NextResponse.json({
      success: true,
      students: filtered,
    });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data siswa" },
      { status: 500 }
    );
  }
}
