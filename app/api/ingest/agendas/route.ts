import { NextRequest, NextResponse } from "next/server";
import { collectAgendaHits, queueAgendaHits } from "@/lib/ingest-agendas";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  const query = request.nextUrl.searchParams.get("secret");
  return header === `Bearer ${secret}` || query === secret;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const hits = await collectAgendaHits();
  const result = await queueAgendaHits(hits);
  return NextResponse.json({
    source: "review_queue only",
    hits: hits.length,
    ...result,
  });
}
