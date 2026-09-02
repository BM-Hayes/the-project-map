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
  {
    slug: "pit-stop-solar",
    name: "Pit Stop Solar",
    siteType: "solar",
    stage: "approved",
    badge: "official",
    county: "darlington",
    state: "SC",
    mw: 75,
    acres: 1100,
    applicant: "Pit Stop Solar, LLC",
    lat: 34.281528,
    lng: -79.927611,
    sourceUrl:
      "https://www.darcosc.com/government/county_council/recently_approved_ordinances.php",
    sourceLabel: "Darlington County recently approved ordinances",
    summary:
      "Utility-scale solar farm near Branhams Airport / Branham Airport Road, southwest of Darlington. County Council adopted FILOT ordinance 24-11 and Florence multi-county industrial park ordinance 24-12 on July 1, 2024, for Pit Stop Solar, LLC, a project the county previously called Project Scout. The fee agreement commits about $115 million in new investment over a 40-year term at a 6% assessment ratio with fixed millage and special source revenue credits. Local reporting and court coverage put the project at nearly 75 MW on about 1,100 acres. Planning Commission site approval (reported February) is under lawsuit; neighbors challenged process and buffering at a December 3, 2025 planning hearing. Pin is Branhams Airport (FAA 6J7), the public landmark used in county and press descriptions — not a surveyed array centroid.",
    notes: [
      "Acreage is not settled in one official figure. WPDE (Aug. 3, 2026) says approximately 1,100 acres; SCNow (Jan. 8, 2026) headlined 845 acres; a May 2026 public post citing a county project list used 1,152.82 acres. Seed uses 1,100 as the figure tied to the Planning Commission / lawsuit coverage. Replace with parcel GIS when the county map or site plan is extracted.",
      "75 MW is from WPDE lawsuit coverage ('nearly 75 megawatts'), not an EIA-860 listing. No plant ID found as of Sept. 2, 2026.",
      "FILOT / MCIP closed July 1, 2024. That is a tax deal, not a building permit. Planning Commission later approved the solar energy system; that approval is the subject of the lawsuit alleging missing findings of fact and conclusions of law.",
      "Parent developer behind Pit Stop Solar, LLC is not confirmed from public filings reviewed here. Do not treat the county code name Project Scout as proof it is Scout Clean Energy.",
      "No next public meeting is on file in this seed. The Aug. 2026 moratorium discussion does not stay the existing lawsuit.",
    ],
    documents: [
      {
        title: "Darlington County Council agenda — Ord. 24-11 FILOT and Ord. 24-12 MCIP third reading (Project Scout / Pit Stop Solar, LLC)",
        url: "https://cms1files.revize.com/darlingtoncounty/July%201,%202024,%20agenda.pdf",
        postedOn: "2024-07-01",
      },
      {
        title: "Ordinance 24-11 — FILOT agreement, Project Scout / Pit Stop Solar, LLC (third-reading version)",
        url: "https://legistarweb-production.s3.amazonaws.com/uploads/attachment/pdf/2706754/2024.06.05_Ordinance_Project_Scout-_3rd_reading_version.pdf",
        postedOn: "2024-07-01",
      },
      {
        title: "Darlington County recently approved ordinances — Ord. 24-11 FILOT and 24-12 MCIP for Pit Stop Solar",
        url: "https://www.darcosc.com/government/county_council/recently_approved_ordinances.php",
      },
      {
        title: "Recently approved resolutions — Resolution 781 inducement, Project Scout",
        url: "https://www.darcosc.com/government/county_council/recently_approved_resolutions/index.php",
      },
      {
        title: "WPDE — neighbors challenge Pitstop Solar at planning hearing",
        url: "https://wpde.com/news/local/darlington-county-pitstop-solar-solar-plant-location-department-of-revenue",
        postedOn: "2025-12-03",
      },
      {
        title: "SCNow — 845-acre Pit Stop Solar farm project approved",
        url: "https://scnow.com/news/local/government-politics/article_f6f4387d-68ab-4907-99ea-d2d42574d8b7.html",
        postedOn: "2026-01-08",
      },
      {
        title: "WPDE — Planning Commission approval lawsuit and proposed 9-month solar/wind moratorium",
        url: "https://wpde.com/news/local/darlington-county-considers-9-month-moratorium-on-new-solar-and-wind-projects",
        postedOn: "2026-08-03",
      },
      {
        title: "Darlington County official solar GIS map",
        url: "https://www.arcgis.com/home/item.html?id=c62ede3f6e1a47068d133ed8edd2781c",
      },
      {
        title: "SC Aeronautics — Branhams Airport (6J7) coordinates used as the map pin",
        url: "https://aeronautics.sc.gov/airports/branhams-airport",
      },
      {
        title: "Darlington County Code App. A Art. 19 — renewable energy systems standards",
        url: "https://library.municode.com/sc/darlington_county/codes/code_of_ordinances?nodeId=APXADESTOR_ARTNINETEENREENSY",
      },
    ],
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
