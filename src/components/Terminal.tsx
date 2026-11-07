"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { projects } from "@/data/projects";
import { me } from "@/data/me";
import { site } from "@/data/site";
import { TERMINAL_EVENT } from "@/lib/terminal";
import { expandById } from "@/lib/sections";
import styles from "./Terminal.module.css";

type Line = { text: string; tone?: "in" | "dim" | "err" | "ok" | "accent"; href?: string };

const PROMPT = "guest@abowsec:~$";
const SECTIONS = ["top", "focus", "work", "now", "about", "faq", "contact"];
const SECTION_ALIASES: Record<string, string> = {
  "~": "top", "/": "top", "..": "top", home: "top", projects: "work", hire: "contact",
};
const PING_HOSTS: Record<string, string> = {
  ephemeris: "ephemeris-online.com",
  "ephemeris-online.com": "ephemeris-online.com",
  github: "github.com",
  "github.com": "github.com",
};

const LINKS: Record<string, string> = { github: site.github };
if (site.linkedin) LINKS.linkedin = site.linkedin;
if (site.email) LINKS.email = `mailto:${site.email}`;
if (site.resume) LINKS.resume = site.resume;
for (const p of projects) if (p.links[0]) LINKS[p.slug] = p.links[0].href;

const COMMANDS: [name: string, usage: string, about: string][] = [
  ["help", "help", "list commands"],
  ["whoami", "whoami", "who runs this box"],
  ["ls", "ls", "list projects"],
  ["now", "now", "what I'm up to right now"],
  ["experience", "experience", "work history"],
  ["cat", "cat <project>", "read about a project"],
  ["open", "open <project|github|linkedin|email>", "open a link"],
  ["cd", "cd <section>", "jump to part of the page"],
  ["ping", "ping <ephemeris|github>", "real HTTPS round trips from your browser"],
  ["traceroute", "traceroute", "the route through this page"],
  ["contact", "contact", "ways to reach me"],
  ["clear", "clear", "clear the screen"],
  ["exit", "exit", "close (or press esc)"],
];

const ARG_POOLS: Record<string, string[]> = {
  cat: projects.map((p) => p.slug),
  open: Object.keys(LINKS),
  cd: SECTIONS,
  ping: ["ephemeris", "github"],
};

const BANNER: Line[] = [
  { text: "abowsec shell · type 'help' to see what you can do", tone: "accent" },
  { text: "tab completes · ↑/↓ history · esc closes", tone: "dim" },
];

const pad = (s: string, n: number) => s.padEnd(n);

export default function Terminal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");

  const print = (...more: Line[]) => setLines((l) => [...l, ...more]);

  // Open on ` (outside text fields) or when something dispatches TERMINAL_EVENT.
  useEffect(() => {
    const show = () => {
      const d = dialogRef.current;
      if (d && !d.open) d.showModal();
      inputRef.current?.focus();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "`" || e.ctrlKey || e.metaKey || e.altKey) return;
      const d = dialogRef.current;
      if (d?.open) return;
      const t = e.target as HTMLElement | null;
      // Don't hijack typing in other fields (the terminal's own input doesn't count).
      if (t?.closest("input, textarea, select, [contenteditable='true']") && !d?.contains(t)) return;
      e.preventDefault();
      show();
    };
    // Closing doesn't always move focus out of the dialog (e.g. Esc when the page had
    // nothing focused before), which would leave keystrokes going to a hidden input.
    const onClose = () => {
      const d = dialogRef.current;
      const active = document.activeElement;
      // `close` fires async; skip if the terminal was already reopened in the meantime.
      if (d && !d.open && active instanceof HTMLElement && d.contains(active)) active.blur();
    };
    const dialog = dialogRef.current;
    window.addEventListener(TERMINAL_EVENT, show);
    window.addEventListener("keydown", onKey);
    dialog?.addEventListener("close", onClose);
    return () => {
      window.removeEventListener(TERMINAL_EVENT, show);
      window.removeEventListener("keydown", onKey);
      dialog?.removeEventListener("close", onClose);
    };
  }, []);

  useEffect(() => {
    const out = outRef.current;
    if (out) out.scrollTop = out.scrollHeight;
  }, [lines]);

  const close = () => dialogRef.current?.close();

  const goTo = (id: string, delay = 0) => {
    setTimeout(() => {
      close();
      expandById(id);
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }, delay);
  };

  const ping = async (host: string) => {
    print({ text: `PING ${host} over HTTPS, timed from your browser`, tone: "dim" });
    const times: number[] = [];
    for (let seq = 1; seq <= 3; seq++) {
      const t0 = performance.now();
      try {
        await fetch(`https://${host}/?ping=${Date.now()}`, { method: "HEAD", mode: "no-cors", cache: "no-store" });
        const ms = performance.now() - t0;
        times.push(ms);
        print({ text: `reply from ${host}: seq=${seq} time=${ms.toFixed(1)} ms${seq === 1 ? "  (may include TLS setup)" : ""}` });
      } catch {
        print({ text: `seq=${seq} request failed`, tone: "err" });
      }
    }
    if (times.length) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      print({
        text: `--- ${times.length}/3 received · min/avg/max = ${Math.min(...times).toFixed(1)}/${avg.toFixed(1)}/${Math.max(...times).toFixed(1)} ms`,
        tone: "ok",
      });
    }
  };

  const run = (raw: string) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    switch (cmd.toLowerCase()) {
      case "":
        return;
      case "help":
        return print(
          ...COMMANDS.map(([, usage, about]) => ({ text: `  ${pad(usage, 40)}${about}` })),
          { text: "  ...and a few things that aren't listed.", tone: "dim" }
        );
      case "whoami":
        return print(
          { text: `${site.name.toLowerCase()}, cs student${me.schoolShort ? ` at ${me.schoolShort.toLowerCase()}` : ""}. networks, security, web.` },
          { text: "status: looking for internships and developer roles", tone: "ok" }
        );
      case "ls":
        return print(
          ...projects.map((p) => ({
            text: `  ${pad(p.slug + "/", 16)}${pad(p.status, 10)}${p.category}`,
          }))
        );
      case "cat": {
        const p = projects.find((x) => x.slug === arg || x.title.toLowerCase() === arg);
        if (!arg) return print({ text: "usage: cat <project>  (try 'ls')", tone: "err" });
        if (!p) return print({ text: `cat: ${arg}: no such project`, tone: "err" });
        return print(
          { text: `${p.title} · ${p.category}${p.course ? ` · ${p.course}` : ""}`, tone: "accent" },
          { text: p.summary },
          ...(p.highlight ? [{ text: `» ${p.highlight}`, tone: "dim" as const }] : []),
          { text: `stack: ${p.stack.join(" / ")}`, tone: "dim" },
          ...p.links.map((l) => ({ text: `→ ${l.label}`, href: l.href }))
        );
      }
      case "open": {
        const href = LINKS[arg];
        if (!href) return print({ text: `open: unknown target. try: ${Object.keys(LINKS).join(", ")}`, tone: "err" });
        print({ text: `opening ${href.replace(/^mailto:/, "")}…`, tone: "ok" });
        if (href.startsWith("mailto:")) window.location.href = href;
        else window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      case "cd": {
        const id = SECTION_ALIASES[arg || "~"] ?? arg;
        if (!SECTIONS.includes(id)) return print({ text: `cd: no such section: ${arg}. try: ${SECTIONS.join(", ")}`, tone: "err" });
        return goTo(id);
      }
      case "ping": {
        const host = PING_HOSTS[arg];
        if (!host) return print({ text: "usage: ping <ephemeris|github>", tone: "err" });
        void ping(host);
        return;
      }
      case "traceroute":
        return print(
          { text: `traceroute to contact, ${SECTIONS.length} hops max`, tone: "dim" },
          ...SECTIONS.map((s, i) => ({ text: `  ${i + 1}  ${s}` })),
          { text: "on a wide screen, the rail on the left traces you live.", tone: "dim" }
        );
      case "contact":
        return print(
          ...(site.email ? [{ text: `email     ${site.email}`, href: `mailto:${site.email}` }] : []),
          ...(site.linkedin ? [{ text: `linkedin  ${site.linkedin.replace("https://www.", "")}`, href: site.linkedin }] : []),
          { text: `github    ${site.github.replace("https://", "")}`, href: site.github }
        );
      case "now":
        return print(
          ...me.now.filter((i) => i.text).map((i) => ({ text: `  ${pad(i.label, 11)}${i.text}` })),
          { text: `updated ${me.nowUpdated} · live commits: cd now`, tone: "dim" }
        );
      case "experience":
        return print(
          ...me.experience.flatMap((r) => [
            { text: `${r.title} · ${r.org}  (${r.start} – ${r.end ?? "present"})`, tone: "accent" as const },
            ...r.points.map((pt) => ({ text: `  - ${pt}` })),
          ]),
          { text: `${me.degree} · ${me.school}, class of ${me.gradYear}`, tone: "dim" }
        );
      case "history":
        return print(...history.current.map((h, i) => ({ text: `  ${i + 1}  ${h}` })));
      case "echo":
        return print({ text: args.join(" ") });
      case "date":
        return print({ text: new Date().toString() });
      case "sudo":
        if (/^hire (andrew|me|abowsec)/.test(arg)) {
          print(
            { text: "[sudo] password for guest: ********", tone: "dim" },
            { text: "access granted. routing you to contact…", tone: "ok" }
          );
          return goTo("contact", 900);
        }
        return print({ text: "guest is not in the sudoers file. This incident will be reported.", tone: "err" });
      case "rm":
        return print({ text: args.includes("-rf") ? "rm: nice try." : "rm: read-only file system", tone: "err" });
      case "clear":
        return setLines([]);
      case "exit":
      case "quit":
        return close();
      default:
        return print({ text: `${cmd}: command not found. try 'help'`, tone: "err" });
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = value;
    print({ text: `${PROMPT} ${cmd}`, tone: "in" });
    if (cmd.trim()) history.current.push(cmd.trim());
    cursor.current = history.current.length;
    setValue("");
    run(cmd);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(h[cursor.current]);
    } else if (e.key === "ArrowDown" && h.length) {
      e.preventDefault();
      cursor.current = Math.min(h.length, cursor.current + 1);
      setValue(h[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.trimStart().split(/\s+/);
      const word = parts[parts.length - 1].toLowerCase();
      const pool = parts.length === 1 ? COMMANDS.map(([name]) => name) : ARG_POOLS[parts[0].toLowerCase()] ?? [];
      const matches = pool.filter((c) => c.startsWith(word));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setValue(parts.join(" ") + " ");
      } else if (matches.length > 1) {
        print({ text: `${PROMPT} ${value}`, tone: "in" }, { text: matches.join("  "), tone: "dim" });
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Terminal"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div
        className={styles.window}
        onClick={() => {
          // Keep text selectable: only refocus the prompt on a plain click.
          if (window.getSelection()?.isCollapsed !== false) inputRef.current?.focus();
        }}
      >
        <div className={styles.bar}>
          <span />
          <span />
          <span />
          <em>guest@abowsec · bash</em>
          <button type="button" className={styles.close} onClick={close} aria-label="Close terminal">
            esc
          </button>
        </div>
        <div ref={outRef} className={styles.out} aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={l.tone ? styles[l.tone] : undefined}>
              {l.href ? (
                <a href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
                  {l.text}
                </a>
              ) : (
                l.text
              )}
            </div>
          ))}
        </div>
        <form className={styles.prompt} onSubmit={submit}>
          <label htmlFor="term-input">{PROMPT}</label>
          <input
            ref={inputRef}
            id="term-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>
    </dialog>
  );
}
