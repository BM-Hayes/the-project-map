import type { Site } from "./types";

/**
 * Offline seed. Public coordinates and official/public filings only.
 * Used when Supabase is empty or unset.
 */
export const SEED_SITES: Site[] = [
  {
    slug: "robinson-solar-center",
    name: "Robinson Solar Center",
    siteType: "solar",
    stage: "application",
    badge: "official",
    county: "darlington",
    state: "SC",
    mw: 76,
    acres: 345,
    applicant: "Duke Energy Progress",
    lat: 34.417114,
    lng: -80.17435,
    sourceUrl: "https://www.duke-energy.com/RobinsonSolarCenter",
    sourceLabel: "Duke Energy project page",
    summary:
      "76 MWac solar PV and associated 230 kV tie on company-owned land next to Robinson Nuclear Plant and the Darlington CT plant. Site spans Chesterfield and Darlington counties. Construction targeted late 2026 or early 2027. Coordinates from the ERM informal consultation filed with SCDNR / PSC docket materials.",
  },
  {
    slug: "darlington-solar-llc",
    name: "Darlington Solar, LLC",
    siteType: "solar",
    stage: "operating",
    badge: "official",
    county: "darlington",
    state: "SC",
    mw: 10,
    applicant: "Darlington Solar, LLC",
    lat: 34.32,
    lng: -79.917,
    sourceUrl: "https://www.eia.gov/electricity/data/eia860/",
    sourceLabel: "EIA-860 plant 60993",
    summary:
      "Operating 10 MW photovoltaic plant at 808 E. Billy Farrow Hwy, Darlington. First operation December 2016. Point from EIA Form 860.",
  },
  {
    slug: "hb-robinson",
    name: "H.B. Robinson Steam Electric Plant",
    siteType: "generation",
    stage: "operating",
    badge: "official",
    county: "darlington",
    state: "SC",
    applicant: "Duke Energy Progress",
    lat: 34.400556,
    lng: -80.151389,
    sourceUrl: "https://www.nrc.gov/docs/ML1915/ML19155A087.pdf",
    sourceLabel: "NRC FSAR site location",
    summary:
      "Operating generation on the southwest shore of Lake Robinson, northwest Darlington County, about three miles west-northwest of Hartsville. FSAR coordinates 34°24′02″ N, 80°09′05″ W. Neighbor and interconnection context for Robinson Solar Center — not a new filing.",
  },
  {
    slug: "tedder-solar",
    name: "Tedder Solar",
    siteType: "solar",
    stage: "operating",
    badge: "official",
    county: "darlington",
    state: "SC",
    mw: 2,
    applicant: "Tedder Solar",
    lat: 34.30181,
    lng: -79.92446,
    sourceUrl: "https://www.eia.gov/electricity/data/eia860/",
    sourceLabel: "EIA-860 plant 62315",
    summary:
      "Operating 2 MW photovoltaic plant near Rogers Road and Harry Byrd Highway, Darlington. First operation December 2021. Point from EIA Form 860.",
  },
];

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
