import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

/** Jumps to the top of the page on every route change. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  // The browser must not restore the old position on its own.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Smooth scrolling keeps its own idea of where the page is, so it has to be
  // told to reset too, otherwise the page stays where it was (or snaps back
  // on the next scroll) when only the content changes, as between case studies.
  useLayoutEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    // Pages that load their content on demand can change the height after this
    // runs, so reset once more on the next frame.
    const id = requestAnimationFrame(() => {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return null;
}
