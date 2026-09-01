import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Public filings, on a map.</h1>
      <p className="lede">
        A filings tracker for large energy and water-touching projects.
        Open a site. See stage, the next public date, and official sources.
      </p>
      <p className="meta">
        Default filter: Darlington County, South Carolina. County is a filter,
        not the brand. Tracker tone only — no petitions, donate buttons, or
        campaign chrome.
      </p>
      <div className="note">
        Holding page while the map path is wired. The home route stays the map.
        Anonymous pin in this browser only. Tips go to <code>review_queue</code>
        and are not auto-published.
      </div>
      <nav className="routes" aria-label="Primary">
        <Link href="/about">About</Link>
        <Link href="/week">This week</Link>
        <Link href="/suggest">Suggest a site</Link>
      </nav>
    </main>
  );
}
