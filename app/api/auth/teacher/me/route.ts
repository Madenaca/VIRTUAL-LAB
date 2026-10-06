import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("teacher_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { authenticated: false, teacher: null },
        { status: 401 }
      );
    }

    const decoded = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );

    if (!decoded || !decoded.username) {
      return NextResponse.json(
        { authenticated: false, teacher: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      teacher: {
        id: decoded.id,
        username: decoded.username,
        nama: decoded.nama,
        nip: decoded.nip,
        role: decoded.role,
      },
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, teacher: null },
      { status: 401 }
    );
  }
}
