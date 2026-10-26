import { useSyncExternalStore } from "react";

// Shared flag so text that animates in on load (Reveal) waits for the preloader.
let active = true;
const listeners = new Set<() => void>();

/** Milliseconds after the overlay starts to fade before the page text starts, so the logo is gone first. */
const TEXT_START_DELAY_MS = 200;

/** Called by the preloader when its overlay starts to fade out. */
export const finishPreloading = () => {
  window.setTimeout(() => {
    active = false;
    listeners.forEach((l) => l());
  }, TEXT_START_DELAY_MS);
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** False on the first page load until the preloader starts to fade; true afterwards and on later page changes. */
export const usePreloaderDone = () =>
  useSyncExternalStore(
    subscribe,
    () => !active,
    () => true,
  );
