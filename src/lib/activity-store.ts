import { useSyncExternalStore } from "react";
import { fetchActivity, type Commit } from "./github";

// Client-side: one shared live copy of the commit feed for every component that
// shows it, refreshed at most every 15 minutes per visitor (cached in localStorage).
const KEY = "abowsec:activity";
const TTL = 15 * 60_000;

let live: Commit[] | null = null;
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function start() {
  if (started) return;
  started = true;
  try {
    const cached = JSON.parse(localStorage.getItem(KEY) ?? "null") as { at: number; data: Commit[] } | null;
    if (cached && Array.isArray(cached.data) && Date.now() - cached.at < TTL) {
      live = cached.data;
      queueMicrotask(emit);
      return;
    }
  } catch {
    // storage unavailable; fall through to the network
  }
  fetchActivity()
    .then((data) => {
      live = data;
      try {
        localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data }));
      } catch {}
      emit();
    })
    .catch(() => {
      // rate-limited or offline: keep showing the build-time snapshot
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

/** Live commits, falling back to the build-time snapshot until (or unless) they arrive. */
export function useActivity(snapshot: Commit[]): Commit[] {
  return useSyncExternalStore(
    subscribe,
    () => live ?? snapshot,
    () => snapshot
  );
}

const noopSubscribe = () => () => {};
/** false during SSR and hydration, true after; for output that depends on "now". */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
