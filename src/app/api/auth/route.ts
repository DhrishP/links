import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { admins } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_key_change_in_prod";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    const [user] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { username: user.username, sub: user.id },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function checkApiAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}
