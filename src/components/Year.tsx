"use client";

import { useEffect, useRef } from "react";

// Renders the build year in the static HTML, then refreshes on the client
// so an old build never shows a stale year.
export default function Year() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = String(new Date().getFullYear());
  }, []);
  return (
    <span ref={ref} suppressHydrationWarning>
      {new Date().getFullYear()}
    </span>
  );
}
