import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Suggest a site",
};

export default function SuggestPage() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Suggest a site</h1>
      <p className="lede">
        Anonymous tip. No account. Your pin stays in this browser. The form
        writes <code>review_queue</code> only — nothing is auto-published.
      </p>
      <div className="note">
        Queue wiring is the next slice after the map. An official source URL
        is required before a site can be published.
      </p>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/week">This week</Link>
      </nav>
    </main>
  );
}
