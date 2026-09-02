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

type MapEngine = {
  Map: new (o: object) => MapLike;
  NavigationControl: new (o: object) => object;
  accessToken?: string;
};

type Props = { sites: Site[]; token: string };

const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v12";
const FREEMAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

function loadScript(src: string, id: string): Promise<void> {
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(src + " failed"));
    document.head.appendChild(script);
  });
}

function loadCss(href: string, id: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

async function loadMapbox(): Promise<MapEngine> {
  loadCss("https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css", "mapbox-gl-css");
  await loadScript("https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js", "mapbox-gl-js");
  const engine = (window as Window & { mapboxgl?: MapEngine }).mapboxgl;
  if (!engine) throw new Error("mapboxgl missing");
  return engine;
}

async function loadMaplibre(): Promise<MapEngine> {
  loadCss("https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css", "maplibre-gl-css");
  await loadScript("https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js", "maplibre-gl-js");
  const engine = (window as Window & { maplibregl?: MapEngine }).maplibregl;
  if (!engine) throw new Error("maplibregl missing");
  return engine;
}

function attachSites(map: MapLike, sites: Site[], onHit: (site: Site) => void) {
  map.addSource("sites", { type: "geojson", data: sitesToGeoJSON(sites) });
  map.addLayer({
    id: "sites-halo",
    type: "circle",
    source: "sites",
    paint: {
      "circle-radius": 11,
      "circle-color": "#f4efe6",
      "circle-opacity": 0.9,
    },
  });
  map.addLayer({
    id: "sites-dots",
    type: "circle",
    source: "sites",
    paint: {
      "circle-radius": 7,
      "circle-color": "#8a4b1f",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fffdf8",
    },
  });
  map.on("click", "sites-dots", (event: { features?: Array<{ properties?: { slug?: string } }> }) => {
    const slug = event.features?.[0]?.properties?.slug;
    const hit = sites.find((site) => site.slug === slug);
    if (hit) onHit(hit);
  });
  map.on("mouseenter", "sites-dots", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "sites-dots", () => {
    map.getCanvas().style.cursor = "";
  });
}

export default function ProjectMap({ sites, token }: Props) {
  const node = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLike | null>(null);
  const [active, setActive] = useState<Site | null>(null);
  const [pin, setPin] = useState("");
  const [engine, setEngine] = useState(token ? "loading" : "loading");

  useEffect(() => {
    setPin(getOrCreatePin());
  }, []);

  useEffect(() => {
    if (!node.current) return;
    let cancelled = false;

    async function boot() {
      try {
        const gl = token ? await loadMapbox() : await loadMaplibre();
        if (cancelled || !node.current) return;
        if (token && gl.accessToken !== undefined) gl.accessToken = token;
        const map = new gl.Map({
          container: node.current,
          style: token ? MAPBOX_STYLE : FREEMAP_STYLE,
          center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
          zoom: DEFAULT_VIEW.zoom,
          antialias: true,
          attributionControl: true,
        });
        map.addControl(new gl.NavigationControl({ showCompass: false }), "top-right");
        map.on("load", () => attachSites(map, sites, setActive));
        mapRef.current = map;
        setEngine(token ? "mapbox" : "maplibre");
      } catch {
        if (cancelled) return;
        if (token) {
          try {
            const gl = await loadMaplibre();
            if (cancelled || !node.current) return;
            const map = new gl.Map({
              container: node.current,
              style: FREEMAP_STYLE,
              center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
              zoom: DEFAULT_VIEW.zoom,
              antialias: true,
            });
            map.addControl(new gl.NavigationControl({ showCompass: false }), "top-right");
            map.on("load", () => attachSites(map, sites, setActive));
            mapRef.current = map;
            setEngine("maplibre");
          } catch {
            setEngine("failed");
          }
        } else {
          setEngine("failed");
        }
      }
    }

    boot();

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
        <div ref={node} className="map-canvas" />
        {engine === "failed" ? (
          <p className="map-fail">Map tiles failed to load. Refresh, or check the style URL.</p>
        ) : null}
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
            ? "Mapbox Streets · public filings only"
            : engine === "maplibre"
              ? "OpenFreeMap Bright · public filings only"
              : engine === "loading"
                ? "Loading map…"
                : "Map failed to load"}
        </span>
        <span>Pin {pin ? pin.slice(0, 8) : "…"}</span>
      </footer>
    </div>
  );
}
