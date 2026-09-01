export type PublicEvent = {
  id: string;
  title: string;
  bodyName?: string;
  startsAt: string;
  agendaUrl?: string;
  plainSummary?: string;
};

export async function getPublishedEvents(): Promise<PublicEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const now = new Date();
  const until = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  try {
    const query = new URL(`${url}/rest/v1/events`);
    query.searchParams.set("published", "eq.true");
    query.searchParams.set("starts_at", `gte.${now.toISOString()}`);
    query.searchParams.set("starts_at", `lte.${until.toISOString()}`);
    query.searchParams.set("select", "id,title,body_name,starts_at,agenda_url,plain_summary");
    query.searchParams.set("order", "starts_at.asc");
    const response = await fetch(query, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 120 },
    });
    if (!response.ok) return [];
    const rows = (await response.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      bodyName: row.body_name ? String(row.body_name) : undefined,
      startsAt: String(row.starts_at),
      agendaUrl: row.agenda_url ? String(row.agenda_url) : undefined,
      plainSummary: row.plain_summary ? String(row.plain_summary) : undefined,
    }));
  } catch {
    return [];
  }
}
