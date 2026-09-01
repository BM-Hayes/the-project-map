const KEY = "tpm_anonymous_pin";

export function getOrCreatePin(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(KEY);
  if (existing) return existing;
  const pin =
    window.crypto?.randomUUID?.() ??
    `pin_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(KEY, pin);
  return pin;
}
