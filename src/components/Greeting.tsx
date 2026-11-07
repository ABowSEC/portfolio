"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { me } from "@/data/me";
import { projects } from "@/data/projects";
import { useActivity } from "@/lib/activity-store";
import type { Commit } from "@/lib/github";
import { previousVisit, rememberProject } from "@/lib/visit";
import styles from "./Greeting.module.css";

// Client-only values, read through useSyncExternalStore so the server render
// (and hydration) see `null` and the browser fills them in without a mismatch.
const noopSubscribe = () => () => {};
const subscribeClock = (tick: () => void) => {
  const id = setInterval(tick, 15_000);
  return () => clearInterval(id);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);
const getReferrer = () => document.referrer;
const none = () => null;

const clock = (timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone });
const hourIn = (date: Date, timeZone?: string) =>
  Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(date));

function salutation(hour: number) {
  if (hour >= 5 && hour < 12) return "good morning.";
  if (hour >= 12 && hour < 17) return "good afternoon.";
  if (hour >= 17 && hour < 22) return "good evening.";
  return "up late?";
}

export default function Greeting({ snapshot }: { snapshot: Commit[] }) {
  const minute = useSyncExternalStore(subscribeClock, currentMinute, none);
  const visit = useSyncExternalStore(noopSubscribe, previousVisit, none);
  const referrer = useSyncExternalStore(noopSubscribe, getReferrer, none);
  const commits = useActivity(snapshot);

  // Remember which project the visitor spends time on, for their next visit.
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("#work article[id]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && rememberProject(e.target.id)),
      { threshold: 0.35 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  // Reserve the line during SSR so nothing jumps when the client fills it in.
  if (minute === null) return <div className={styles.greeting} aria-hidden="true" />;

  const now = new Date(minute * 60_000);
  const yours = clock().format(now).toLowerCase();
  const mine = clock(me.timezone).format(now).toLowerCase();
  const myHour = hourIn(now, me.timezone);
  const asleep = myHour >= 23 || myHour < 7;

  const timeLine =
    yours === mine
      ? `it's ${yours} for both of us.`
      : `it's ${yours} for you, ${mine} for me (${me.timezoneLabel}).`;

  let second: ReactNode = null;
  if (visit) {
    const p = projects.find((x) => x.slug === visit.project);
    const fresh = p ? commits.filter((c) => c.slug === p.slug && Date.parse(c.date) > visit.last).length : 0;
    second = p ? (
      <>
        welcome back. last time you were looking at{" "}
        <a href={`#${p.slug}`}>{p.title}</a>
        {fresh > 0
          ? `, which has ${fresh >= 4 ? "4+" : fresh} new commit${fresh === 1 ? "" : "s"} since.`
          : "."}
      </>
    ) : (
      "welcome back."
    );
  } else if (referrer && /linkedin\./i.test(referrer)) {
    second = (
      <>
        hi from LinkedIn. short version: networking + full-stack, looking for internships.{" "}
        <a href="#contact">contact ↓</a>
      </>
    );
  } else if (referrer && /github\.com/i.test(referrer)) {
    second = "hi from GitHub. every project below links to its source.";
  }

  return (
    <div className={styles.greeting}>
      <p>
        <span className={styles.dot} aria-hidden="true" />
        {salutation(now.getHours())} {timeLine}
        {asleep && <span className={styles.aside}> (I&apos;m probably asleep, but email works.)</span>}
      </p>
      {second && <p className={styles.second}>{second}</p>}
    </div>
  );
}
