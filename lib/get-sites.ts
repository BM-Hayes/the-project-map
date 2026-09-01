import { getSeedSite, getSeedSites } from "./seed-sites";
import type { Site } from "./types";

/**
 * Prefer published Supabase rows when the separate project is configured.
 * Always fall back to the offline GeoJSON/TS seed so the map is not empty.
 */
export async function getPublishedSites(): Promise<Site[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return getSeedSites();

  try {
    const query = new URL(`${url}/rest/v1/sites`);
    query.searchParams.set("published", "eq.true");
    query.searchParams.set("county", "eq.darlington");
    query.searchParams.set("select", "*");
    const response = await fetch(query, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) return getSeedSites();
    const rows = (await response.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows) || rows.length === 0) return getSeedSites();
    return rows
      .filter((row) => typeof row.slug === "string" && typeof row.lat === "number")
      .map((row) => ({
        slug: String(row.slug),
        name: String(row.name),
        siteType: row.site_type as Site["siteType"],
        stage: row.stage as Site["stage"],
        badge: row.badge as Site["badge"],
        county: String(row.county ?? "darlington"),
        state: "SC",
        mw: typeof row.mw === "number" ? row.mw : undefined,
        acres: typeof row.acres === "number" ? row.acres : undefined,
        applicant: row.applicant ? String(row.applicant) : undefined,
        lat: Number(row.lat),
        lng: Number(row.lng),
        sourceUrl: String(row.source_url ?? ""),
        sourceLabel: "Official source",
        nextEventOn: row.next_event_on ? String(row.next_event_on) : undefined,
        summary: String(row.name),
      }));
  } catch {
    return getSeedSites();
  }
}

export function getSiteOrSeed(slug: string): Site | undefined {
  return getSeedSite(slug);
}
