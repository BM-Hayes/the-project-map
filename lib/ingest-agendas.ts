export type IngestHit = {
  title: string;
  bodyName: string;
  startsAt?: string;
  sourceUrl: string;
  note: string;
};

const GRANICUS =
  "https://darcosc.granicus.com/ViewPublisher.php?view_id=1";
const PLANNING =
  "https://www.darcosc.com/government/boards_commissions/planning_commission/agendas_minutes.php";

function parseMonthDayYear(text: string): Date | null {
  const match = text.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),\s+(20\d{2})\b/i,
  );
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]}, ${match[3]} 18:00:00 GMT-0400`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function thirdWednesday(year: number, monthIndex: number) {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const wedOffset = (3 - first.getUTCDay() + 7) % 7;
  const day = 1 + wedOffset + 14;
  return new Date(Date.UTC(year, monthIndex, day, 20, 0, 0));
}

export async function collectAgendaHits(): Promise<IngestHit[]> {
  const hits: IngestHit[] = [];
  const now = Date.now();

  try {
    const html = await fetch(GRANICUS, {
      headers: { "User-Agent": "TheProjectMap/0.1 (agenda ingest; review_queue only)" },
      cache: "no-store",
    }).then((r) => r.text());
    const rowRe =
      /Darlington County Council[\s\S]{0,80}?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+20\d{2}[\s\S]{0,400}?AgendaViewer\.php\?view_id=1&clip_id=(\d+)/gi;
    let match: RegExpExecArray | null;
    const seen = new Set<string>();
    while ((match = rowRe.exec(html))) {
      const date = parseMonthDayYear(match[0]);
      const clip = match[2];
      const sourceUrl = `https://darcosc.granicus.com/AgendaViewer.php?view_id=1&clip_id=${clip}`;
      if (!date || seen.has(sourceUrl)) continue;
      seen.add(sourceUrl);
      if (date.getTime() + 24 * 60 * 60 * 1000 < now) continue;
      hits.push({
        title: "County Council",
        bodyName: "Darlington County",
        startsAt: date.toISOString(),
        sourceUrl,
        note: "Parsed from official Granicus listing. Confirm agenda before publish.",
      });
    }
  } catch {
    hits.push({
      title: "County Council listing unavailable",
      bodyName: "Darlington County",
      sourceUrl: GRANICUS,
      note: "Fetch of Granicus listing failed.",
    });
  }

  const today = new Date();
  for (let i = 0; i < 2; i += 1) {
    const month = today.getUTCMonth() + i;
    const year = today.getUTCFullYear() + Math.floor(month / 12);
    const date = thirdWednesday(year, month % 12);
    if (date.getTime() + 24 * 60 * 60 * 1000 < now) continue;
    hits.push({
      title: "Planning Commission (scheduled 3rd Wednesday, 4 p.m.)",
      bodyName: "Darlington County",
      startsAt: date.toISOString(),
      sourceUrl: PLANNING,
      note: "Schedule rule from the official Planning Commission agendas page. Do not publish until that month's agenda PDF is posted.",
    });
  }

  return hits;
}

export async function queueAgendaHits(hits: IngestHit[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { queued: 0, error: "missing supabase env" };

  let queued = 0;
  for (const hit of hits) {
    const response = await fetch(`${url}/rest/v1/review_queue`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        kind: "agenda_ingest",
        source_url: hit.sourceUrl,
        status: "pending",
        payload: { ...hit, auto_publish: false },
      }),
    });
    if (response.ok) queued += 1;
  }
  return { queued, attempted: hits.length };
}
