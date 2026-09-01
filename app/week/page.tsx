import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "This week",
};

export default function WeekPage() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Next 14 days</h1>
      <p className="lede">
        Hearings, comment windows, and other public dates. Printable text list.
      </p>
      <p className="meta">No published events in the next 14 days.</p>
      <div className="note">
        This route will read the <code>events</code> table once Supabase is
        connected. The list stays empty rather than inventing dates.
      </div>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Map</Link>
        <Link href="/about">About</Link>
        <Link href="/suggest">Suggest a site</Link>
      </nav>
    </main>
  );
}
