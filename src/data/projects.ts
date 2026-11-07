export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  status: "live" | "featured" | "wip";
  course?: string;
  image?: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "ephemeris",
    title: "Ephemeris",
    category: "Web app",
    summary:
      "Every upcoming rocket launch worldwide in one place, with live countdowns, webcasts, a launch map and alerts for the launches you follow. It pulls from multiple APIs and keeps everything current.",
    // TODO: replace with the real stack, e.g. ["Next.js", "Launch Library 2", ...]
    stack: ["Web app", "REST APIs"],
    status: "live",
    image: "/img/ephemeris.png",
    links: [{ label: "Visit site", href: "https://ephemeris-online.com" }],
  },
  {
    slug: "netsleuth",
    title: "NetSleuth",
    category: "Network tool",
    summary:
      "A passive network monitor. It sees which devices are on your network, what they look up and who they talk to, without sending a single packet. A live dashboard shows it all, and a model trained on captured traffic flags anything unusual.",
    stack: ["Python", "Scapy", "Flask", "scikit-learn"],
    status: "featured",
    // TODO: add a dashboard screenshot at /img/netsleuth.png and set image here
    links: [{ label: "Source", href: "https://github.com/ABowSEC/NetSleuth" }],
  },
  {
    slug: "codebreaker",
    title: "CodeBreaker",
    category: "Networked game",
    summary:
      "Mastermind over TCP. Two players take turns cracking a code held by the server, using an application-layer protocol I'm designing from the ground up.",
    stack: ["Python", "TCP sockets", "Protocol design"],
    status: "wip",
    course: "CS 457 · Computer Networks",
    links: [],
  },
  {
    slug: "vr-workspace",
    title: "VR Workspace",
    category: "Virtual reality",
    // TODO: add the engine and a sentence on what the workspace does
    summary: "An immersive workspace for doing research in VR, built for a research course.",
    stack: ["VR"],
    status: "wip",
    course: "Research course",
    links: [],
  },
];
