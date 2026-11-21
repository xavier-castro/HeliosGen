import { NextRequest, NextResponse } from "next/server";
import {
  getCivitaiApiKey,
  setCivitaiApiKey,
  deleteCivitaiApiKey,
} from "@/lib/guest/db";

export async function GET() {
  return NextResponse.json({ hasToken: !!getCivitaiApiKey() });
}

export async function POST(req: NextRequest) {
  const { civitaiApiKey } = await req.json();
  if (typeof civitaiApiKey !== "string" || !civitaiApiKey.trim()) {
    return NextResponse.json({ error: "civitaiApiKey is required" }, { status: 400 });
  }
  setCivitaiApiKey(civitaiApiKey.trim());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  deleteCivitaiApiKey();
  return NextResponse.json({ ok: true });
}
