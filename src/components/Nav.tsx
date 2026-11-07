"use client";

import { useEffect, useRef, useState } from "react";
import { openTerminal } from "@/lib/terminal";
import { useSectionProgress } from "@/lib/useSectionProgress";
import styles from "./Nav.module.css";

const links = [
  { href: "#work", label: "Work" },
  { href: "#now", label: "Now" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

// Sections that drive the active link (reaching contact clears it).
const tracked = ["work", "now", "about", "faq", "contact"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { index } = useSectionProgress(tracked);
  const active = index >= 0 ? tracked[index] : null;

  // While the mobile menu is open: Escape or a click outside closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={headerRef} className={`${styles.nav} ${scrolled || open ? styles.solid : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#top" onClick={close}>
          abowsec<span className={styles.cursor}>_</span>
        </a>

        <button
          ref={toggleRef}
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="nav-links" className={`${styles.links} ${open ? styles.open : ""}`}>
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className={isActive ? styles.active : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                {l.label}
              </a>
            );
          })}
          <button
            type="button"
            className={styles.termBtn}
            onClick={() => {
              close();
              openTerminal();
            }}
            aria-label="Open terminal"
            title="Terminal (press `)"
          >
            <span aria-hidden="true">&gt;_</span>
            <span className={styles.termLabel} aria-hidden="true">
              Terminal
            </span>
          </button>
          <a className="btn btn-primary" href="#contact" onClick={close}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
