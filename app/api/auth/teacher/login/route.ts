import { NextRequest, NextResponse } from "next/server";
import { getPool, inMemoryStore, initDatabase } from "@/lib/db";

// In-memory rate limiting to block brute-force attempts from unauthorized students
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(key: string): { isLocked: boolean; remainingSeconds: number } {
  const record = failedAttemptsMap.get(key);
  if (!record) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  if (record.lockedUntil <= now && record.count >= 5) {
    // Lock period expired, reset
    failedAttemptsMap.delete(key);
    return { isLocked: false, remainingSeconds: 0 };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = failedAttemptsMap.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    // Lock for 3 minutes after 5 consecutive failures
    record.lockedUntil = now + 3 * 60 * 1000;
  }

  failedAttemptsMap.set(key, record);
}

function clearFailedAttempts(key: string) {
  failedAttemptsMap.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous_client";
    const rateLimitKey = `${ip}_${username || "unknown"}`;

    // 1. Check rate limiter
    const rateLimit = checkRateLimit(rateLimitKey);
    if (rateLimit.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan gagal. Akses login terkunci selama ${rateLimit.remainingSeconds} detik untuk keamanan portal pendidik.`,
        },
        { status: 429 }
      );
    }

    // 2. Validate input - Cukup username dan password
    if (!username || !username.trim() || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // 3. Database lookup
    const mysqlReady = await initDatabase();
    let teacher: any = null;

    if (mysqlReady) {
      try {
        const pool = getPool();
        const [rows]: any = await pool.query(
          "SELECT id, username, password_hash, nama, nip, role FROM guru WHERE username = ? LIMIT 1",
          [cleanUsername]
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
        (g) => g.username.toLowerCase() === cleanUsername.toLowerCase()
      );
    }

    // 4. Verify Credentials (Username & Password)
    if (!teacher || teacher.password_hash !== password) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: "Username atau password salah." },
        { status: 401 }
      );
    }

    // 5. Verify Role
    if (teacher.role && teacher.role !== "guru" && teacher.role !== "admin") {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Akun ini tidak terdaftar sebagai Tenaga Pendidik / Admin.",
        },
        { status: 403 }
      );
    }

    // Success - reset failure counter
    clearFailedAttempts(rateLimitKey);

    // 7. Create Session
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
      message: "Login berhasil. Selamat datang di Portal Guru.",
      teacher: {
        id: teacher.id,
        username: teacher.username,
        nama: teacher.nama,
        nip: teacher.nip,
        role: teacher.role,
      },
    });

    // Set secure HTTP-only cookie
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
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
