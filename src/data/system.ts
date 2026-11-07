// The hero's "system map": real pieces of Andrew's work, wired together.
// ring: 0 = center, 1-3 = the three orbit rings. angle: degrees, 0 = right, counter-clockwise.
// Only the left part of the art is on screen (x ≲ 440 of 600), so nodes live there.

export type SystemNode = {
  id: string;
  label: string;
  ring: 0 | 1 | 2 | 3;
  angle: number;
  kind: "me" | "work" | "project";
  href?: string;
};

export type SystemEdge = { from: string; to: string; kind: "work" | "project"; both?: boolean };

export const RING_RADII = [0, 120, 200, 280] as const;

export const nodes: SystemNode[] = [
  { id: "me", label: "Andrew", ring: 0, angle: 0, kind: "me", href: "#about" },
  { id: "sis", label: "CSU SIS", ring: 1, angle: 122, kind: "work", href: "#about" },
  { id: "boomi", label: "Boomi", ring: 2, angle: 142, kind: "work", href: "#about" },
  { id: "db", label: "Campus DB", ring: 3, angle: 116, kind: "work", href: "#about" },
  { id: "ephemeris", label: "Ephemeris", ring: 2, angle: 204, kind: "project", href: "#ephemeris" },
  { id: "netsleuth", label: "NetSleuth", ring: 3, angle: 236, kind: "project", href: "#netsleuth" },
  { id: "codebreaker", label: "CodeBreaker", ring: 1, angle: 292, kind: "project", href: "#codebreaker" },
];

export const edges: SystemEdge[] = [
  // The integration chain from the SIS internship: data flows both ways.
  { from: "sis", to: "boomi", kind: "work", both: true },
  { from: "boomi", to: "db", kind: "work", both: true },
  { from: "me", to: "sis", kind: "work" },
  // Side projects.
  { from: "me", to: "ephemeris", kind: "project" },
  { from: "me", to: "netsleuth", kind: "project" },
  { from: "me", to: "codebreaker", kind: "project" },
];
