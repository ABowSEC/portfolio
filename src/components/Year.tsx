"use client";

import { useEffect, useRef } from "react";

// Filled in on the client so the static build never shows a stale year.
export default function Year() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = String(new Date().getFullYear());
  }, []);
  return <span ref={ref} />;
}
