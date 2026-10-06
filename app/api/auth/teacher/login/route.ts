import { NextRequest, NextResponse } from "next/server";
import { getPool, inMemoryStore, initDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const mysqlReady = await initDatabase();
    let teacher: any = null;

    if (mysqlReady) {
      try {
        const pool = getPool();
        const [rows]: any = await pool.query(
          "SELECT id, username, password_hash, nama, nip, role FROM guru WHERE username = ? LIMIT 1",
          [username]
        );
        if (rows && rows.length > 0) {
          teacher = rows[0];
        }
      } catch (err) {
        console.warn("MySQL query error, checking memory store:", err);
      }
    }

    // Fallback to in-memory store if MySQL not yet running
    if (!teacher) {
      teacher = inMemoryStore.guru.find(
        (g) => g.username.toLowerCase() === username.toLowerCase()
      );
    }

    if (!teacher || teacher.password_hash !== password) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Create session payload
    const sessionData = {
      id: teacher.id,
      username: teacher.username,
      nama: teacher.nama,
      nip: teacher.nip,
      role: teacher.role,
      authenticatedAt: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      teacher: {
        id: teacher.id,
        username: teacher.username,
        nama: teacher.nama,
        nip: teacher.nip,
        role: teacher.role,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set("teacher_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
