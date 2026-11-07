"use client";

import { useEffect } from "react";
import { expandById } from "@/lib/sections";

// Makes every in-page link (#id) open the collapsible section that contains its
// target before the browser scrolls, including links in SVG, the nav and the
// trace rail. Also handles a URL that arrives with a #hash.
export default function SectionLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) expandById(decodeURIComponent(href.slice(1)));
    };

    const openHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      expandById(id);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };

    document.addEventListener("click", onClick, true); // capture: run before the default scroll
    window.addEventListener("hashchange", openHash);
    openHash();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", openHash);
    };
  }, []);

  return null;
}
