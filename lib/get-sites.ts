import { getSeedSite, getSeedSites } from "./seed-sites";
import type { Site } from "./types";

function mergeSites(fromDb: Site[], fromSeed: Site[]): Site[] {
  const bySlug = new Map<string, Site>();
  for (const site of fromDb) bySlug.set(site.slug, site);
  for (const site of fromSeed) {
    const existing = bySlug.get(site.slug);
    if (!existing) {
      bySlug.set(site.slug, site);
      continue;
    }
    bySlug.set(site.slug, {
      ...existing,
      documents: existing.documents ?? site.documents,
      notes: existing.notes ?? site.notes,
      summary: existing.summary || site.summary,
      sourceLabel: existing.sourceLabel || site.sourceLabel,
    });
  }
  return Array.from(bySlug.values());
}

/**
 * Prefer published Supabase rows when the separate project is configured.
 * Always union with the offline seed so research added here appears on the map
 * before a database insert.
 */
export async function getPublishedSites(): Promise<Site[]> {
  const seed = getSeedSites();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return seed;

  try {
    const query = new URL(`${url}/rest/v1/sites`);
    query.searchParams.set("published", "eq.true");
    query.searchParams.set("county", "eq.darlington");
    query.searchParams.set("select", "*");
    const response = await fetch(query, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 0 },
    });
    if (!response.ok) return seed;
    const rows = (await response.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows) || rows.length === 0) return seed;
    const fromDb = rows
      .filter((row) => typeof row.slug === "string" && typeof row.lat === "number")
      .map((row) => ({
        slug: String(row.slug),
        name: String(row.name),
        siteType: row.site_type as Site["siteType"],
        stage: row.stage as Site["stage"],
        badge: row.badge as Site["badge"],
        county: String(row.county ?? "darlington"),
        state: "SC" as const,
        mw: typeof row.mw === "number" ? row.mw : undefined,
        acres: typeof row.acres === "number" ? row.acres : undefined,
        applicant: row.applicant ? String(row.applicant) : undefined,
        lat: Number(row.lat),
        lng: Number(row.lng),
        sourceUrl: String(row.source_url ?? ""),
        sourceLabel: row.source_label ? String(row.source_label) : "Official source",
        nextEventOn: row.next_event_on ? String(row.next_event_on) : undefined,
        summary: String(row.summary ?? row.name),
      }));
    return mergeSites(fromDb, seed);
  } catch {
    return seed;
  }
}

export function getSiteOrSeed(slug: string): Site | undefined {
  return getSeedSite(slug);
}
