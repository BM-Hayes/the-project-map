import ProjectMap from "@/components/ProjectMap";
import { getPublishedSites } from "@/lib/get-sites";

export default async function HomePage() {
  const sites = await getPublishedSites();
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  return <ProjectMap sites={sites} token={token} />;
}
