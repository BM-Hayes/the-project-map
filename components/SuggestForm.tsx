"use client";

import { FormEvent, useEffect, useState } from "react";
import { getOrCreatePin } from "@/lib/pin";

export default function SuggestForm() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "queued" | "blocked" | "error">("idle");

  useEffect(() => {
    setPin(getOrCreatePin());
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const source_url = String(data.get("source_url") ?? "");
    if (!source_url) {
      setStatus("blocked");
      return;
    }
    const payload = {
      pin,
      name: String(data.get("name") ?? ""),
      county: String(data.get("county") ?? "darlington"),
      source_url,
      note: String(data.get("note") ?? ""),
      intended_table: "review_queue",
      auto_publish: false,
    };
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const response = await fetch(`${url}/rest/v1/review_queue`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          kind: "suggest",
          source_url,
          status: "pending",
          payload,
        }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
    } else {
      const storageKey = "tpm_review_queue_local";
      const prior = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown[];
      window.localStorage.setItem(storageKey, JSON.stringify([payload, ...prior]));
    }
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
        Writes <code>review_queue</code> only. Official URL required. Pin{" "}
        {pin ? pin.slice(0, 8) : "…"}.
      </p>
      <button type="submit">Queue tip</button>
      {status === "queued" ? (
        <p className="note">Queued for review. Not published.</p>
      ) : null}
      {status === "blocked" ? (
        <p className="note">Official source URL is required.</p>
      ) : null}
      {status === "error" ? (
        <p className="note">Queue insert failed. Check Supabase RLS / anon key.</p>
      ) : null}
    </form>
  );
}
