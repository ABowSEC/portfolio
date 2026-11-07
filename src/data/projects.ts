export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  /** One line on the hardest problem solved or the key takeaway. */
  highlight?: string;
  stack: string[];
  status: "live" | "featured" | "wip";
  course?: string;
  image?: string;
  links: { label: string; href: string }[];
  /** GitHub repo name under ABowSEC, used for live activity. */
  repo?: string;
  /** Interactive panel shown in place of a screenshot. */
  demo?: "protocol-inspector";
};

// Details below are taken from each project's README and source on GitHub.
export const projects: Project[] = [
  {
    slug: "ephemeris",
    title: "Ephemeris",
    category: "Web app · PWA",
    summary:
      "A free, ad-free spaceflight dashboard. Every upcoming launch worldwide with live countdowns, a 3D launch globe, launch alerts and calendar export, plus live ISS tracking and NASA imagery. Installable, and it keeps working offline from cached data.",
    highlight:
      "Launch Library's free tier allows 15 calls an hour, so a cron Worker refreshes the feed into Workers KV every 15 minutes and visitors read from the edge, falling back to a cached copy when the upstream fails. Launch-site lighting comes from a small Rust module compiled to WebAssembly.",
    stack: ["React", "TypeScript", "Three.js", "Cloudflare Workers + KV", "Rust → WASM", "PWA"],
    status: "live",
    repo: "Project-Ephemeris",
    image: "/img/ephemeris.png",
    links: [
      { label: "Visit site", href: "https://ephemeris-online.com" },
      { label: "Source", href: "https://github.com/ABowSEC/Project-Ephemeris" },
    ],
  },
  {
    slug: "netsleuth",
    title: "NetSleuth",
    category: "Network tool",
    summary:
      "An inventory of everything on your home network. It identifies each device by MAC address (maker, type, hostname, IP history), tracks who's home right now, and flags the few things worth knowing: an address claimed by two devices, one device port-scanning another, or a device sweeping the network.",
    highlight:
      "Passive capture only sees devices that talk, so it's paired with a periodic ARP sweep that finds the quiet ones, like printers and idle phones. Packets become facts (sightings, hostnames, DNS lookups, flows) in a pipeline backed by SQLite, and nothing leaves the machine.",
    stack: ["Python", "Scapy", "Flask", "SQLite", "Next.js", "pytest"],
    status: "featured",
    repo: "NetSleuth",
    // TODO: add a dashboard screenshot at /img/netsleuth.png and set image here
    links: [{ label: "Source", href: "https://github.com/ABowSEC/NetSleuth" }],
  },
  {
    slug: "codebreaker",
    title: "CodeBreaker",
    category: "Networked game",
    summary:
      "Mastermind over TCP. Two players take turns cracking a code held by the server, using an application-layer protocol I'm designing from the ground up.",
    highlight:
      "Each message is UTF-8 JSON behind a 4-byte big-endian length prefix, so the stream frames cleanly without delimiters. Eight message types, each with its own state-machine spec.",
    stack: ["Python", "TCP sockets", "Length-prefixed framing", "FSM design"],
    status: "wip",
    course: "CS 457 · Computer Networks",
    repo: "CS457-CodeBreaker",
    demo: "protocol-inspector",
    links: [{ label: "Protocol docs", href: "https://github.com/ABowSEC/CS457-CodeBreaker" }],
  },
  {
    slug: "vr-workspace",
    title: "VR Office Study",
    category: "Virtual reality",
    summary:
      "A user study comparing a 2D desktop with a VR office on Meta Quest 2. Both conditions share the same Three.js scene, tasks, timing and logging. Only the input changes, from a mouse ray to a controller ray.",
    highlight:
      "Layout set B mirrors set A with new labels, so both conditions have equal movement distances without anyone seeing the same layout twice. Condition order is counterbalanced per participant.",
    stack: ["Three.js", "WebXR", "Vite", "Meta Quest 2"],
    status: "wip",
    course: "CS 464 · Research project",
    repo: "VROffice",
    links: [{ label: "Source", href: "https://github.com/ABowSEC/VROffice" }],
  },
];
