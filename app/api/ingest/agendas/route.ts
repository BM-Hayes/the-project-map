import { NextRequest, NextResponse } from "next/server";
import { collectAgendaHits, queueAgendaHits } from "@/lib/ingest-agendas";

export async function GET(request: NextRequest) {
  const expected = (process.env.CRON_SECRET ?? "").trim();
  if (!expected) {
    return NextResponse.json({ error: "missing CRON_SECRET on this deploy" }, { status: 401 });
  }
  const header = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const query = (request.nextUrl.searchParams.get("secret") ?? "").trim();
  if (header !== expected && query !== expected) {
    return NextResponse.json({ error: "secret mismatch" }, { status: 401 });
  }
  const hits = await collectAgendaHits();
  const result = await queueAgendaHits(hits);
  return NextResponse.json({
    source: "review_queue only",
    hits: hits.length,
    ...result,
  });
}
