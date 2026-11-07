"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { EXPAND_EVENT, LAYOUT_EVENT } from "@/lib/sections";
import Reveal from "./Reveal";
import styles from "./CollapsibleSection.module.css";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  summary?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
};

// A page section whose heading toggles its content.
// - Without JS (or before hydration fails over) everything stays visible.
// - Closed content uses hidden="until-found", so Ctrl+F can still find it and
//   opens the section (Chrome/Edge); other browsers simply hide it.
// - Links pointing inside a closed section open it first (see SectionLinks).
export default function CollapsibleSection({
  id,
  eyebrow,
  title,
  summary,
  defaultOpen = false,
  className,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyId = `${id}-content`;

  // Open when something navigates into this section.
  useEffect(() => {
    const onExpand = (e: Event) => {
      const target = (e as CustomEvent<Element>).detail;
      if (target && sectionRef.current?.contains(target)) {
        // Synchronous, so the browser scrolls to the right spot right after.
        flushSync(() => setOpen(true));
      }
    };
    const body = bodyRef.current;
    const onFound = () => setOpen(true);
    window.addEventListener(EXPAND_EVENT, onExpand);
    body?.addEventListener("beforematch", onFound);
    return () => {
      window.removeEventListener(EXPAND_EVENT, onExpand);
      body?.removeEventListener("beforematch", onFound);
    };
  }, []);

  // Keep the DOM `hidden` state in sync (React has no "until-found" value).
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (open) body.removeAttribute("hidden");
    else body.setAttribute("hidden", "until-found");
    window.dispatchEvent(new Event(LAYOUT_EVENT));
  }, [open]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`section ${styles.section} ${className ?? ""}`}
      data-collapsed={open ? "false" : "true"}
    >
      <div className="container">
        <Reveal>
          <div className={`section-head ${styles.head}`}>
            <span className="eyebrow">{eyebrow}</span>
            <h2>
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => setOpen((o) => !o)}
              >
                <span>{title}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h2>
            {summary && <p>{summary}</p>}
          </div>
        </Reveal>

        <div id={bodyId} ref={bodyRef} className={styles.body}>
          {children}
        </div>
      </div>
    </section>
  );
}
