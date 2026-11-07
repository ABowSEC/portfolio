// Coordination between collapsible sections and anything that navigates to them
// (nav, trace rail, hero nodes, terminal `cd`, in-page links).

/** "Open whichever section contains this element." detail: Element */
export const EXPAND_EVENT = "abowsec:expand";
/** A section opened or closed, so page geometry changed. */
export const LAYOUT_EVENT = "abowsec:layout";

export function expandFor(target: Element | null) {
  if (target) window.dispatchEvent(new CustomEvent<Element>(EXPAND_EVENT, { detail: target }));
}

export function expandById(id: string) {
  expandFor(document.getElementById(id));
}
