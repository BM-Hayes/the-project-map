"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BADGE_LABEL, STAGE_LABEL, TYPE_LABEL } from "@/lib/labels";
import { getOrCreatePin } from "@/lib/pin";
import { DEFAULT_VIEW, sitesToGeoJSON } from "@/lib/seed-sites";
import type { Site } from "@/lib/types";

type MapLike = {
  flyTo: (o: { center: [number, number]; zoom: number; essential?: boolean }) => void;
  remove: () => void;
  addSource: (id: string, source: object) => void;
  addLayer: (layer: object) => void;
  addControl: (control: object, pos?: string) => void;
  on: (ev: string, a?: unknown, b?: unknown) => void;
  getCanvas: () => HTMLCanvasElement;
};

type Props = { sites: Site[]; token: string };

function loadMapbox(): Promise<{
  Map: new (o: object) => MapLike;
  NavigationControl: new (o: object) => object;
  accessToken: string;
}> {
  const w = window as Window & { mapboxgl?: { Map: new (o: object) => MapLike; NavigationControl: new (o: object) => object; accessToken: string } };
  if (w.mapboxgl) return Promise.resolve(w.mapboxgl);
  return new Promise((resolve, reject) => {
    const cssId = "mapbox-gl-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js";
    script.async = true;
    script.onload = () => {
      if (w.mapboxgl) resolve(w.mapboxgl);
      else reject(new Error("mapboxgl missing"));
    };
    script.onerror = () => reject(new Error("mapbox script failed"));
    document.head.appendChild(script);
  });
}

export default function ProjectMap({ sites, token }: Props) {
  const node = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLike | null>(null);
  const [active, setActive] = useState<Site | null>(null);
  const [pin, setPin] = useState("");
  const [engine, setEngine] = useState(token ? "loading" : "osm");

  useEffect(() => {
    setPin(getOrCreatePin());
  }, []);

  useEffect(() => {
    if (!token || !node.current) return;
    let cancelled = false;

    loadMapbox()
      .then((mapboxgl) => {
        if (cancelled || !node.current) return;
        mapboxgl.accessToken = token;
        const map = new mapboxgl.Map({
          container: node.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
          zoom: DEFAULT_VIEW.zoom,
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        map.on("load", () => {
          map.addSource("sites", { type: "geojson", data: sitesToGeoJSON(sites) });
          map.addLayer({
            id: "sites-dots",
            type: "circle",
            source: "sites",
            paint: {
              "circle-radius": 7,
              "circle-color": "#8a4b1f",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#f4efe6",
            },
          });
          map.on("click", "sites-dots", (event: { features?: Array<{ properties?: { slug?: string } }> }) => {
            const slug = event.features?.[0]?.properties?.slug;
            const hit = sites.find((site) => site.slug === slug);
            if (hit) setActive(hit);
          });
          map.on("mouseenter", "sites-dots", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "sites-dots", () => {
            map.getCanvas().style.cursor = "";
          });
        });
        mapRef.current = map;
        setEngine("mapbox");
      })
      .catch(() => setEngine("osm"));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, sites]);

  function focusSite(site: Site) {
    setActive(site);
    mapRef.current?.flyTo({ center: [site.lng, site.lat], zoom: 12, essential: true });
  }

  const bbox = "-80.35,34.15,-79.70,34.52";
  const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${DEFAULT_VIEW.lat}%2C${DEFAULT_VIEW.lng}`;
  const showOsm = !token || engine === "osm";

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
        {token ? <div ref={node} className="map-canvas" /> : null}
        {showOsm ? <iframe className="map-canvas" title="Darlington County map" src={osm} /> : null}
        <aside className="map-list" aria-label="Seed sites">
          <p className="list-kicker">Published seed · Darlington</p>
          {sites.map((site) => (
            <button
              key={site.slug}
              type="button"
              className={active?.slug === site.slug ? "site-row on" : "site-row"}
              onClick={() => focusSite(site)}
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
          <div className="popup">
            <p className="badge-row">
              <span>{TYPE_LABEL[active.siteType]}</span>
              <span>{STAGE_LABEL[active.stage]}</span>
              <span className="badge">{BADGE_LABEL[active.badge]}</span>
            </p>
            <h2>{active.name}</h2>
            <p className="meta">{active.summary}</p>
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
        <span>
          {engine === "mapbox"
            ? "Mapbox light · public filings only"
            : engine === "loading"
              ? "Loading Mapbox…"
              : "OSM fallback · Mapbox token missing or blocked"}
        </span>
        <span>Pin {pin ? pin.slice(0, 8) : "…"}</span>
      </footer>
    </div>
  );
}
