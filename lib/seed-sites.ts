import type { Site } from "./types";
import { SEED_CORE } from "./seed-core";
import { SEED_PLANNED } from "./seed-planned";

/**
 * Offline seed. Public coordinates and official/public filings only.
 * Used when Supabase is empty or unset.
 */
export const SEED_SITES: Site[] = [...SEED_CORE, ...SEED_PLANNED];

export const DEFAULT_VIEW = {
  county: "darlington",
  state: "SC",
  lat: 34.33235,
  lng: -79.95769,
  zoom: 10,
} as const;

export function getSeedSites(county = DEFAULT_VIEW.county): Site[] {
  return SEED_SITES.filter((site) => site.county === county);
}

export function getSeedSite(slug: string): Site | undefined {
  return SEED_SITES.find((site) => site.slug === slug);
}

export function sitesToGeoJSON(sites: Site[]) {
  return {
    type: "FeatureCollection" as const,
    features: sites.map((site) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [site.lng, site.lat],
      },
      properties: {
        slug: site.slug,
        name: site.name,
        siteType: site.siteType,
        stage: site.stage,
        badge: site.badge,
      },
    })),
  };
}
