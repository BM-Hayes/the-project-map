export type IngestHit = {
  title: string;
  bodyName: string;
  startsAt?: string;
  sourceUrl: string;
  note: string;
};

const GRANICUS =
  "https://darcosc.granicus.com/ViewPublisher.php?view_id=1";
const COUNTY_PC =
  "https://www.darcosc.com/government/boards_commissions/planning_commission/agendas_minutes.php";
const HARTSVILLE_NOTICE =
  "https://www.hartsvillesc.gov/home/showpublisheddocument/477";
const CITY_DARLINGTON_PC =
  "https://www.cityofdarlington.com/planning-commission/";

function parseMonthDayYear(text: string): Date | null {
  const match = text.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),\s+(20\d{2})\b/i,
  );
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]}, ${match[3]} 18:00:00 GMT-0400`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nthWeekdayUTC(
  year: number,
  monthIndex: number,
  weekday: number,
  nth: number,
  hourUtc: number,
) {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  return new Date(Date.UTC(year, monthIndex, day, hourUtc, 0, 0));
}

function lastWeekdayUTC(
  year: number,
  monthIndex: number,
  weekday: number,
  hourUtc: number,
) {
  const last = new Date(Date.UTC(year, monthIndex + 1, 0));
  const back = (last.getUTCDay() - weekday + 7) % 7;
  return new Date(Date.UTC(year, monthIndex, last.getUTCDate() - back, hourUtc, 0, 0));
}

function upcomingMonths() {
  const today = new Date();
  const out: Array<{ year: number; month: number }> = [];
  for (let i = 0; i < 2; i += 1) {
    const month = today.getUTCMonth() + i;
    out.push({
      year: today.getUTCFullYear() + Math.floor(month / 12),
      month: month % 12,
    });
  }
  return out;
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

  for (const { year, month } of upcomingMonths()) {
    const countyPc = nthWeekdayUTC(year, month, 3, 3, 20);
    if (countyPc.getTime() + 86400000 >= now) {
      hits.push({
        title: "Planning Commission (3rd Wednesday, 4 p.m.)",
        bodyName: "Darlington County",
        startsAt: countyPc.toISOString(),
        sourceUrl: COUNTY_PC,
        note: "Official county schedule rule. Do not publish until that month's agenda PDF is posted.",
      });
    }

    const hartCouncil = nthWeekdayUTC(year, month, 2, 2, 21);
    if (hartCouncil.getTime() + 86400000 >= now) {
      hits.push({
        title: "City Council (2nd Tuesday, 5:30 p.m.)",
        bodyName: "City of Hartsville",
        startsAt: hartCouncil.toISOString(),
        sourceUrl: HARTSVILLE_NOTICE,
        note: "Official 2026 annual meeting notice. Confirm the posted agenda before publish.",
      });
    }

    const hartPc = lastWeekdayUTC(year, month, 1, 21);
    if (hartPc.getTime() + 86400000 >= now) {
      hits.push({
        title: "Planning Commission (last Monday, 5:30 p.m.)",
        bodyName: "City of Hartsville",
        startsAt: hartPc.toISOString(),
        sourceUrl: HARTSVILLE_NOTICE,
        note: "Pattern from the official 2026 annual notice. Confirm the posted agenda before publish.",
      });
    }

    const cityPc = nthWeekdayUTC(year, month, 3, 3, 13);
    if (cityPc.getTime() + 86400000 >= now) {
      hits.push({
        title: "Planning Commission (3rd Wednesday, 9 a.m.)",
        bodyName: "City of Darlington",
        startsAt: cityPc.toISOString(),
        sourceUrl: CITY_DARLINGTON_PC,
        note: "Official Planning Commission page. Do not publish until that month's agenda is posted.",
      });
    }
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
