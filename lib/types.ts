export type SiteType =
  | "solar"
  | "bess"
  | "data_center"
  | "large_load"
  | "generation"
  | "transmission"
  | "other";

export type SiteStage =
  | "rumor"
  | "application"
  | "hearing"
  | "approved"
  | "under_construction"
  | "operating"
  | "withdrawn";

export type SourceBadge = "official" | "verified" | "community" | "unverified";

export type Site = {
  slug: string;
  name: string;
  siteType: SiteType;
  stage: SiteStage;
  badge: SourceBadge;
  county: string;
  state: "SC";
  mw?: number;
  acres?: number;
  applicant?: string;
  lat: number;
  lng: number;
  sourceUrl: string;
  sourceLabel: string;
  nextEventOn?: string;
  summary: string;
};
