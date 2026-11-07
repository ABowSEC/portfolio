// Remembers, in this browser only, when someone last visited and which project
// they were looking at. Nothing leaves the visitor's machine.
const KEY = "abowsec:visit";
const RETURN_GAP = 30 * 60_000; // a reload within 30 min isn't a "return"

export type Visit = { last: number; project?: string };

let previous: Visit | null | undefined;

function read(): Visit | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v.last === "number" ? v : null;
  } catch {
    return null;
  }
}

function write(v: Visit) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
}

/** The visit before this one, if it was long enough ago to count. Read once per page load. */
export function previousVisit(): Visit | null {
  if (previous === undefined) {
    const v = read();
    previous = v && Date.now() - v.last > RETURN_GAP ? v : null;
    write({ ...(v ?? {}), last: Date.now() });
  }
  return previous;
}

export function rememberProject(slug: string) {
  write({ ...(read() ?? {}), last: Date.now(), project: slug });
}
