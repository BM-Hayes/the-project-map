import dynamic from "next/dynamic";
import { getPublishedSites } from "@/lib/get-sites";

const ProjectMap = dynamic(() => import("@/components/ProjectMap"), {
  ssr: false,
  loading: () => (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <p className="lede">Loading map…</p>
    </main>
  ),
});

export default async function HomePage() {
  const sites = await getPublishedSites();
  return <ProjectMap sites={sites} />;
}
