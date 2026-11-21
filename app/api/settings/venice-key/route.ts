import { NextRequest, NextResponse } from "next/server";
import {
  getVeniceApiKey,
  setVeniceApiKey,
  deleteVeniceApiKey,
} from "@/lib/guest/db";

export async function GET() {
  return NextResponse.json({ hasToken: !!getVeniceApiKey() });
}

export async function POST(req: NextRequest) {
  const { veniceApiKey } = await req.json();
  if (typeof veniceApiKey !== "string" || !veniceApiKey.trim()) {
    return NextResponse.json({ error: "veniceApiKey is required" }, { status: 400 });
  }
  setVeniceApiKey(veniceApiKey.trim());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  deleteVeniceApiKey();
  return NextResponse.json({ ok: true });
}
