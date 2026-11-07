import Hero from "@/components/Hero";
import Focus from "@/components/Focus";
import Work from "@/components/Work";
import Now from "@/components/Now";
import About from "@/components/About";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { me } from "@/data/me";
import { site } from "@/data/site";

// Structured data so search engines understand who this page is about.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: `${me.experience[0]?.title} · ${me.experience[0]?.org}`,
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: me.school },
    { "@type": "CollegeOrUniversity", name: "Front Range Community College" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Fort Collins", addressRegion: "CO" },
  sameAs: [site.github, site.linkedin].filter(Boolean),
  knowsAbout: ["Systems integration", "Computer networking", "Network security", "Web development"],
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Focus />
      <Work />
      <Now />
      <About />
      <Faq />
      <Contact />
    </main>
  );
}
