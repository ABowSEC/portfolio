"use client";

// Runs `html` during HTML parsing on full page loads, without React's
// "script tag while rendering" warning on the client. Pattern from
// node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
