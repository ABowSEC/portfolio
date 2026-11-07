import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TraceRail from "@/components/TraceRail";
import Terminal from "@/components/Terminal";
import InlineScript from "@/components/InlineScript";
import SectionLinks from "@/components/SectionLinks";
import { site } from "@/data/site";
import "./globals.css";

// Headings: a soft, warm serif. Body: a friendly sans. Mono only for code-ish details.
const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// The social preview image comes from src/app/opengraph-image.png (file convention).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name, url: site.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
    firstName: "Andrew",
    lastName: "Bowman",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before first paint, so scroll-reveal only hides
            content when it can actually reveal it again. If the app never hydrates
            (a script failed to load), drop the class after 4s so nothing stays hidden. */}
        <InlineScript html="var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-hydrated'))d.classList.remove('js')},4000)" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <TraceRail />
        <Terminal />
        <SectionLinks />
      </body>
    </html>
  );
}
