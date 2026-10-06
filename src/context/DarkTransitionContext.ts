import { createContext, useContext } from "react";

export const DarkTransitionContext = createContext(false);

/** Whether the shared light-to-dark scroll transition has switched on, so page content (e.g. the testimonial section) can crossfade its own background in sync. */
export function useDarkTransition() {
  return useContext(DarkTransitionContext);
}
