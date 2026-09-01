import type { SiteStage, SiteType, SourceBadge } from "./types";

export const TYPE_LABEL: Record<SiteType, string> = {
  solar: "Solar",
  bess: "Storage",
  data_center: "Data center",
  large_load: "Large load",
  generation: "Generation",
  transmission: "Transmission",
  other: "Other",
};

export const STAGE_LABEL: Record<SiteStage, string> = {
  rumor: "Rumor",
  application: "Application",
  hearing: "Hearing",
  approved: "Approved",
  under_construction: "Under construction",
  operating: "Operating",
  withdrawn: "Withdrawn",
};

export const BADGE_LABEL: Record<SourceBadge, string> = {
  official: "official",
  verified: "verified",
  community: "community",
  unverified: "unverified",
};
