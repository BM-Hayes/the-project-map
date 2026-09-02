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
    slug: "lotus-solar",
    name: "Lotus Solar",
    siteType: "solar",
    stage: "approved",
    badge: "official",
    county: "darlington",
    state: "SC",
    mw: 75,
    acres: 644,
    applicant: "Lotus Solar, LLC (Pine Gate Renewables)",
    lat: 34.447832,
    lng: -80.10356,
    sourceUrl: "https://www.interconnection.fyi/eia/project/68337-lotus",
    sourceLabel: "EIA-860M plant 68337",
    summary:
      "Proposed 75 MW photovoltaic plant east of Hartsville. EIA lists regulatory approvals received, not under construction, with a listed commercial operation date of October 1, 2027. Interconnects to Duke Energy Progress (CPLE). Project company Lotus Solar, LLC uses the Pine Gate Renewables office at 130 Roberts Street, Asheville, N.C., and is a debtor in the Pine Gate Chapter 11 case filed November 6, 2025.",
    notes: [
      "644 acres is the Corps review area (SAC-2022-01330), not confirmed array acreage.",
      "County FILOT ordinances 23-13 and 23-14 and inducement resolution 762 had first reading July 3, 2023. Confirm final adoption with the clerk before treating the tax deal as closed.",
      "No next public meeting is on file in this seed. Meetings stay empty until separately entered.",
    ],
    documents: [
      {
        title: "EIA-860M — Lotus Solar plant 68337 / generator LOTUS",
        url: "https://www.interconnection.fyi/eia/project/68337-lotus",
      },
      {
        title: "Global Energy Monitor — Lotus (SC) solar farm",
        url: "https://www.gem.wiki/Lotus_(SC)_solar_farm",
      },
      {
        title: "USACE SAC-2022-01330 dry-land AJD (Dec 27, 2022)",
        url: "https://www.sac.usace.army.mil/Portals/43/docs/regulatory/jds/December_2022/SAC-2022-01330_LotusSolar_DryLand.pdf",
        postedOn: "2022-12-27",
      },
      {
        title: "PSC ND-2022-33-E — FERC Form 556 QF self-certification",
        url: "https://dms.psc.sc.gov/Web/Ndi/Detail/515",
        postedOn: "2022-07-18",
      },
      {
        title: "PSC Docket 2024-42-E — DEP / Lotus Solar PPA accepted for filing (Order 2024-164)",
        url: "https://dms.psc.sc.gov/Web/Dockets/Detail/118898",
        postedOn: "2024-03-07",
      },
      {
        title: "Public redacted Large QF PPA",
        url: "https://dms.psc.sc.gov/Attachments/Matter/97b2ae1a-86ce-4c6f-b9ea-2cccf5ca4442",
      },
      {
        title: "Darlington County Council agenda — Project Lotus FILOT first reading (Ord. 23-13, 23-14, Res. 762)",
        url: "https://cms1files.revize.com/darlingtoncounty/July%203,%202023,%20agenda.pdf",
        postedOn: "2023-07-03",
      },
      {
        title: "Pine Gate Renewables Chapter 11 lead case 25-90669 (Lotus Solar LLC member 25-90778)",
        url: "https://omniagentsolutions.com/PGR",
        postedOn: "2025-11-06",
      },
    ],
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
