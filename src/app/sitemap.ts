import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Prerendered to out/sitemap.xml by the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
