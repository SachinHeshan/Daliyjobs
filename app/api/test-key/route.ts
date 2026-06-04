import { NextResponse } from "next/server";
import { google } from "googleapis";
import crypto from "crypto";

export async function GET() {
  const pk = process.env.GOOGLE_PRIVATE_KEY;
  if (!pk) return NextResponse.json({ error: "No key" });

  try {
    const formatted1 = pk.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
    crypto.createPrivateKey(formatted1);
    return NextResponse.json({ success: true, method: "formatted1" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, pk_start: pk.substring(0, 30) });
  }
}
