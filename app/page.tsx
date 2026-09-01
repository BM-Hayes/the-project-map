import Link from "next/link";
import { BADGE_LABEL, STAGE_LABEL, TYPE_LABEL } from "@/lib/labels";
import { DEFAULT_VIEW, getSeedSites } from "@/lib/seed-sites";

export default function HomePage() {
  const sites = getSeedSites("darlington");
  const bbox = "-80.35,34.15,-79.70,34.52";
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${DEFAULT_VIEW.lat}%2C${DEFAULT_VIEW.lng}`;

  return (
    <div className="map-app">
      <header className="map-bar">
        <div>
          <p className="wordmark">The Project Map</p>
          <p className="filter-chip">Darlington County, SC</p>
        </div>
        <nav className="map-nav">
          <Link href="/week">Week</Link>
          <Link href="/suggest">Suggest</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <div className="map-stage">
        <iframe
          className="map-canvas"
          title="Darlington County map"
          src={embed}
        />
        <aside className="map-list" aria-label="Seed sites">
          <p className="list-kicker">Published seed · GeoJSON fallback</p>
          {sites.map((site) => (
            <Link key={site.slug} href={`/site/${site.slug}`} className="site-row">
              <strong>{site.name}</strong>
              <span>
                {TYPE_LABEL[site.siteType]} · {STAGE_LABEL[site.stage]} ·{" "}
                {BADGE_LABEL[site.badge]}
              </span>
            </Link>
          ))}
        </aside>
      </div>
      <footer className="map-foot">
        <span>OSM embed until Mapbox token is in Vercel env</span>
        <span>Anonymous pin after first visit</span>
      </footer>
    </div>
  );
}
