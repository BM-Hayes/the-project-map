"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BADGE_LABEL, STAGE_LABEL, TYPE_LABEL } from "@/lib/labels";
import { getOrCreatePin } from "@/lib/pin";
import { DEFAULT_VIEW, sitesToGeoJSON } from "@/lib/seed-sites";
import type { Site } from "@/lib/types";

type Props = { sites: Site[] };

export default function ProjectMap({ sites }: Props) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<Site | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapNote, setMapNote] = useState("Loading map…");
  const [pin, setPin] = useState("");

  useEffect(() => {
    setPin(getOrCreatePin());
  }, []);

  useEffect(() => {
    if (!mapNode.current) return;
    let cancelled = false;
    let map: { remove: () => void } | null = null;

    async function boot() {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const geojson = sitesToGeoJSON(sites);

      try {
        if (token) {
          const mapboxgl = (await import("mapbox-gl")).default;
          await import("mapbox-gl/dist/mapbox-gl.css");
          if (cancelled || !mapNode.current) return;
          mapboxgl.accessToken = token;
          const instance = new mapboxgl.Map({
            container: mapNode.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
            zoom: DEFAULT_VIEW.zoom,
            attributionControl: true,
          });
          instance.on("load", () => {
            addCircleLayer(instance, geojson);
            instance.on("click", "sites-circle", (event) => {
              const slug = event.features?.[0]?.properties?.slug as
                | string
                | undefined;
              const hit = sites.find((site) => site.slug === slug);
              if (hit) setActive(hit);
            });
            instance.on("mouseenter", "sites-circle", () => {
              instance.getCanvas().style.cursor = "pointer";
            });
            instance.on("mouseleave", "sites-circle", () => {
              instance.getCanvas().style.cursor = "";
            });
            setMapReady(true);
            setMapNote("Mapbox · Darlington County default");
          });
          map = instance;
          return;
        }

        const maplibregl = (await import("maplibre-gl")).default;
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !mapNode.current) return;
        const instance = new maplibregl.Map({
          container: mapNode.current,
          style: "https://tiles.openfreemap.org/styles/positron",
          center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
          zoom: DEFAULT_VIEW.zoom,
        });
        instance.on("load", () => {
          addCircleLayer(instance, geojson);
          instance.on("click", "sites-circle", (event) => {
            const slug = event.features?.[0]?.properties?.slug as
              | string
              | undefined;
            const hit = sites.find((site) => site.slug === slug);
            if (hit) setActive(hit);
          });
          instance.on("mouseenter", "sites-circle", () => {
            instance.getCanvas().style.cursor = "pointer";
          });
          instance.on("mouseleave", "sites-circle", () => {
            instance.getCanvas().style.cursor = "";
          });
          setMapReady(true);
          setMapNote(
            "Offline tiles until NEXT_PUBLIC_MAPBOX_TOKEN is set · Darlington default",
          );
        });
        map = instance;
      } catch {
        setMapNote("Map failed to load. Site list below still works.");
      }
    }

    void boot();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [sites]);

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
        <div ref={mapNode} className="map-canvas" />
        {!mapReady ? <p className="map-fallback">{mapNote}</p> : null}
        <aside className="map-list" aria-label="Seed sites">
          <p className="list-kicker">Published seed · GeoJSON fallback</p>
          {sites.map((site) => (
            <button
              key={site.slug}
              type="button"
              className={active?.slug === site.slug ? "site-row on" : "site-row"}
              onClick={() => setActive(site)}
            >
              <strong>{site.name}</strong>
              <span>
                {TYPE_LABEL[site.siteType]} · {STAGE_LABEL[site.stage]} ·{" "}
                {BADGE_LABEL[site.badge]}
              </span>
            </button>
          ))}
        </aside>
        {active ? (
          <div className="popup" role="dialog" aria-label={active.name}>
            <p className="badge-row">
              <span className="badge">{BADGE_LABEL[active.badge]}</span>
              <span>{STAGE_LABEL[active.stage]}</span>
            </p>
            <h2>{active.name}</h2>
            <p className="meta">
              {TYPE_LABEL[active.siteType]}
              {active.mw ? ` · ${active.mw} MW` : ""}
            </p>
            <p>{active.summary}</p>
            <p>
              <a href={active.sourceUrl} rel="noreferrer" target="_blank">
                {active.sourceLabel}
              </a>
            </p>
            <p>
              <Link href={`/site/${active.slug}`}>Open dossier</Link>
              {" · "}
              <button type="button" className="text-btn" onClick={() => setActive(null)}>
                Close
              </button>
            </p>
          </div>
        ) : null}
      </div>
      <footer className="map-foot">
        <span>{mapNote}</span>
        <span title="Stored only in this browser">
          Anonymous pin {pin ? pin.slice(0, 8) : "…"}
        </span>
      </footer>
    </div>
  );
}

function addCircleLayer(
  map: {
    addSource: (id: string, source: object) => void;
    addLayer: (layer: object) => void;
  },
  geojson: object,
) {
  map.addSource("sites", { type: "geojson", data: geojson });
  map.addLayer({
    id: "sites-circle",
    type: "circle",
    source: "sites",
    paint: {
      "circle-radius": 7,
      "circle-color": "#8a4b1f",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#f4efe6",
    },
  });
}
