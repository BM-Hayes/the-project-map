import dynamic from "next/dynamic";
import { getSeedSites } from "@/lib/seed-sites";

const ProjectMap = dynamic(() => import("@/components/ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="map-app">
      <header className="map-bar">
        <p className="wordmark">The Project Map</p>
        <p className="filter-chip">Darlington County, SC</p>
      </header>
      <div className="map-stage" />
    </div>
  ),
});

export default function HomePage() {
  const sites = getSeedSites("darlington");
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  return <ProjectMap sites={sites} token={token} />;
}
