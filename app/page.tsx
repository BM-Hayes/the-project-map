import ProjectMap from "@/components/ProjectMap";
import { getSeedSites } from "@/lib/seed-sites";

export default function HomePage() {
  const sites = getSeedSites("darlington");
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  return <ProjectMap sites={sites} token={token} />;
}
