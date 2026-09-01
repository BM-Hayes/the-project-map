import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEvents } from "@/lib/get-events";

export const metadata: Metadata = {
  title: "This week",
};

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function WeekPage() {
  const events = await getPublishedEvents();

  return (
    <main className="shell">
      <p className="wordmark">The Project Map</p>
      <h1>Upcoming dates</h1>
      <p className="lede">
        Hearings, comment windows, and other public dates in the next 45 days.
        Empty if nothing is published. No invented calendars.
      </p>
      {events.length === 0 ? (
        <p className="meta">No published events in the next 45 days.</p>
      ) : (
        <ul className="plain">
          {events.map((event) => (
            <li key={event.id}>
              <strong>{formatWhen(event.startsAt)}</strong>
              {" — "}
              {event.title}
              {event.bodyName ? ` (${event.bodyName})` : ""}
              {event.agendaUrl ? (
                <>
                  {" · "}
                  <a href={event.agendaUrl} rel="noreferrer" target="_blank">
                    Agenda
                  </a>
                </>
              ) : null}
              {event.plainSummary ? <div className="meta">{event.plainSummary}</div> : null}
            </li>
          ))}
        </ul>
      )}
      <div className="note">
        This page reads <code>events</code> only. <code>review_queue</code> rows never
        appear here. published must be true and starts_at must be in the next 45 days.
      </div>
      <nav className="routes" aria-label="Primary">
        <Link href="/">Map</Link>
        <Link href="/about">About</Link>
        <Link href="/suggest">Suggest a site</Link>
      </nav>
    </main>
  );
}
