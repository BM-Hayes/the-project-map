import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BADGE_LABEL, STAGE_LABEL, TYPE_LABEL } from "@/lib/labels";
import { SEED_SITES, getSeedSite } from "@/lib/seed-sites";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SEED_SITES.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = getSeedSite(slug);
  return { title: site?.name ?? "Site" };
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const site = getSeedSite(slug);
  if (!site) notFound();

  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <p className="meta">
        {TYPE_LABEL[site.siteType]} · {STAGE_LABEL[site.stage]} ·{" "}
        {BADGE_LABEL[site.badge]}
      </p>
      <h1>{site.name}</h1>
      <p className="lede">{site.summary}</p>
      <ul className="plain">
        <li>County: Darlington, SC (default filter)</li>
        {site.mw ? <li>Capacity: {site.mw} MW</li> : null}
        {site.acres ? <li>Acres (reported): {site.acres}</li> : null}
        {site.applicant ? <li>Applicant / operator: {site.applicant}</li> : null}
        <li>
          Coordinates: {site.lat}, {site.lng}
        </li>
        <li>
          Official source:{" "}
          <a href={site.sourceUrl} rel="noreferrer" target="_blank">
            {site.sourceLabel}
          </a>
        </li>
        <li>Next public date: {site.nextEventOn ?? "none on file"}</li>
      </ul>
      {site.notes && site.notes.length > 0 ? (
        <ul className="plain">
          {site.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {site.documents && site.documents.length > 0 ? (
        <>
          <h2>Source documents</h2>
          <ul className="plain">
            {site.documents.map((doc) => (
              <li key={doc.url}>
                <a href={doc.url} rel="noreferrer" target="_blank">
                  {doc.title}
                </a>
                {doc.postedOn ? ` · ${doc.postedOn}` : ""}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="note">
        Meetings and new filings stay empty until separately entered. Unpublished
        community tips never appear here.
      </div>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Map</Link>
        <Link href="/week">This week</Link>
        <Link href="/suggest">Suggest a site</Link>
        <Link href="/about">About</Link>
      </nav>
    </main>
  );
}
