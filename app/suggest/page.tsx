import type { Metadata } from "next";
import Link from "next/link";
import SuggestForm from "@/components/SuggestForm";

export const metadata: Metadata = {
  title: "Suggest a site",
};

export default function SuggestPage() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Suggest a site</h1>
      <p className="lede">
        Anonymous tip. No account. Your pin stays in this browser. Submissions
        are staged for <code>review_queue</code> only — nothing is
        auto-published.
      </p>
      <SuggestForm />
      <nav className="routes" aria-label="Primary">
        <Link href="/">Map</Link>
        <Link href="/about">About</Link>
        <Link href="/week">This week</Link>
      </nav>
    </main>
  );
}
