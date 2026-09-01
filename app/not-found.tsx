import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Not on the map.</h1>
      <p className="lede">That path does not exist yet.</p>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
    </main>
  );
}
