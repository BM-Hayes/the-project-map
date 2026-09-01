import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>About</h1>
      <p className="lede">
        This site tracks public filings for large energy and water-touching
        projects. It is a map first. It is not a newsroom and not a campaign.
      </p>
      <h2>Scope</h2>
      <ul className="plain">
        <li>Solar, storage, data centers, large-load, generation, transmission.</li>
        <li>Water and PFAS context when it touches those sites.</li>
        <li>Default geography: Darlington County, SC.</li>
      </ul>
      <h2>Source badges</h2>
      <p className="meta">official · verified · community · unverified</p>
      <p>
        A site is published only with an official source URL. Community tips
        land in a review queue. They are not promoted automatically.
      </p>
      <h2>What this is not</h2>
      <p>
        Not Weekend Atlas. Separate product, domain, data, and chrome. No
        shared header, footer, or tables.
      </p>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/week">This week</Link>
        <Link href="/suggest">Suggest a site</Link>
      </nav>
    </main>
  );
}
