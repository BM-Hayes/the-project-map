import ProjectMap from "@/components/ProjectMap";
import { getPublishedSites } from "@/lib/get-sites";

export default async function HomePage() {
  const sites = await getPublishedSites();
  return <ProjectMap sites={sites} />;
}
