import { useEffect, useState } from "react";
import { LAYOUT_EVENT } from "./sections";

export type SectionTrace = {
  /** Index of the section under the reading line, or -1 above the first one. */
  index: number;
  /** Fractional position between sections, e.g. 2.4 = 40% of the way from 2 to 3. */
  position: number;
  /** ms since page load when each section was first reached (undefined = never). */
  reachedAt: (number | undefined)[];
};

const READING_LINE = 0.35; // fraction of the viewport height

/**
 * Tracks which of `ids` the reader is in. `ids` must be a stable (module-level) array.
 * Re-renders only when the active section changes, unless `trackPosition` is set.
 */
export function useSectionProgress(ids: readonly string[], trackPosition = false): SectionTrace {
  const [trace, setTrace] = useState<SectionTrace>({ index: -1, position: 0, reachedAt: [] });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const { scrollY, innerHeight } = window;
      const line = scrollY + innerHeight * READING_LINE;
      const tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + scrollY : Number.POSITIVE_INFINITY;
      });

      let index = -1;
      tops.forEach((top, i) => {
        if (top <= line) index = i;
      });

      let position = Math.max(index, 0);
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        // Short last sections never reach the reading line, so the bottom counts as the end.
        index = ids.length - 1;
        position = index;
      } else if (index >= 0 && index < ids.length - 1) {
        const span = tops[index + 1] - tops[index];
        if (Number.isFinite(span) && span > 0) {
          position = index + Math.min(1, (line - tops[index]) / span);
        }
      }

      setTrace((prev) => {
        const newlyReached = index >= 0 && prev.reachedAt[index] === undefined;
        const moved = trackPosition && Math.abs(prev.position - position) > 0.001;
        if (prev.index === index && !newlyReached && !moved) return prev;
        let reachedAt = prev.reachedAt;
        if (newlyReached) {
          reachedAt = [...prev.reachedAt];
          reachedAt[index] = performance.now();
        }
        return { index, position, reachedAt };
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener(LAYOUT_EVENT, schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(LAYOUT_EVENT, schedule);
    };
  }, [ids, trackPosition]);

  return trace;
}
