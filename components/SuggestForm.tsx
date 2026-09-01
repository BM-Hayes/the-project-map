"use client";

import { FormEvent, useEffect, useState } from "react";
import { getOrCreatePin } from "@/lib/pin";

export default function SuggestForm() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "queued" | "blocked">("idle");

  useEffect(() => {
    setPin(getOrCreatePin());
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      pin,
      name: String(data.get("name") ?? ""),
      county: String(data.get("county") ?? "darlington"),
      source_url: String(data.get("source_url") ?? ""),
      note: String(data.get("note") ?? ""),
      intended_table: "review_queue",
      auto_publish: false,
    };
    if (!payload.source_url) {
      setStatus("blocked");
      return;
    }
    const key = "tpm_review_queue_local";
    const prior = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
    window.localStorage.setItem(key, JSON.stringify([payload, ...prior]));
    setStatus("queued");
    event.currentTarget.reset();
  }

  return (
    <form className="suggest" onSubmit={onSubmit}>
      <label>
        Site or project name
        <input name="name" required maxLength={200} />
      </label>
      <label>
        County
        <input name="county" defaultValue="darlington" maxLength={80} />
      </label>
      <label>
        Official source URL
        <input name="source_url" type="url" required placeholder="https://" />
      </label>
      <label>
        Note
        <textarea name="note" rows={4} maxLength={2000} />
      </label>
      <p className="meta">
        Writes <code>review_queue</code> only. Official URL required before any
        later publish. Pin {pin ? pin.slice(0, 8) : "…"}.
      </p>
      <button type="submit">Queue tip</button>
      {status === "queued" ? (
        <p className="note">
          Held locally until the separate Supabase project accepts inserts into{" "}
          <code>review_queue</code>. Not published.
        </p>
      ) : null}
      {status === "blocked" ? (
        <p className="note">Official source URL is required.</p>
      ) : null}
    </form>
  );
}
