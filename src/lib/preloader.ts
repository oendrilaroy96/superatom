import { useSyncExternalStore } from "react";

// Shared flag so text that animates in on load (Reveal) waits for the preloader.
let active = true;
const listeners = new Set<() => void>();

/** Called by the preloader when its overlay starts to fade out. */
export const finishPreloading = () => {
  active = false;
  listeners.forEach((l) => l());
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
