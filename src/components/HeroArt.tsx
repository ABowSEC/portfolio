import { RING_RADII, edges, nodes, type SystemNode } from "@/data/system";
import styles from "./HeroArt.module.css";

// Server-rendered SVG art for the hero. Motion is SMIL + CSS only (no JS), and
// everything decorative is hidden under prefers-reduced-motion.

const C = 300; // center of the 600×600 constellation

function polar(n: SystemNode) {
  const r = RING_RADII[n.ring];
  const a = (n.angle * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
}

const pos = Object.fromEntries(nodes.map((n) => [n.id, polar(n)]));
const f = (v: number) => Math.round(v * 10) / 10;

/** A gentle arc from a to b, bowed to one side by 18% of its length. */
function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (a.x + b.x) / 2 - (dy / len) * len * 0.18;
  const cy = (a.y + b.y) / 2 + (dx / len) * len * 0.18;
  return `M${f(a.x)} ${f(a.y)} Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`;
}

const wires = edges.map((e, i) => ({ ...e, i, d: arc(pos[e.from], pos[e.to]) }));

// ---- Pulse to packet --------------------------------------------------------
// ECG heartbeats (EMT training) that flatten out and become a square-wave data
// signal. The bits spell "abowsec" in 8-bit ASCII.
const BASE = 38;
const HIGH = 24;
const LOW = 46;

function heartbeat(): string {
  let d = `M0 ${BASE}`;
  for (let x0 = 0; x0 < 480; x0 += 160) {
    d +=
      ` L${x0 + 10} ${BASE} Q${x0 + 18} ${BASE - 8} ${x0 + 26} ${BASE}` + // P wave
      ` L${x0 + 40} ${BASE} L${x0 + 44} ${BASE + 5}` + // Q
      ` L${x0 + 50} 4 L${x0 + 56} 54 L${x0 + 62} ${BASE}` + // R spike, S dip
      ` L${x0 + 80} ${BASE} Q${x0 + 95} ${BASE - 12} ${x0 + 110} ${BASE}` + // T wave
      ` L${x0 + 160} ${BASE}`;
  }
  // The rhythm calms down before the data starts.
  d += ` Q500 ${BASE - 7} 520 ${BASE} Q540 ${BASE + 5} 560 ${BASE} Q580 ${BASE - 3} 600 ${BASE} L620 ${BASE}`;
  return d;
}

const SECRET = "abowsec";
const bits = [...SECRET].flatMap((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0").split("").map(Number));

function dataSignal(): string {
  const start = 620;
  const step = (1200 - start) / bits.length;
  let d = `M${start} ${BASE}`;
  bits.forEach((b, i) => {
    const x = f(start + i * step);
    d += ` L${x} ${b ? HIGH : LOW} L${f(start + (i + 1) * step)} ${b ? HIGH : LOW}`;
  });
  return d + ` L1200 ${BASE}`;
}

const ECG_BEAT = heartbeat();
const ECG_DATA = dataSignal();
const ECG_FULL = `${ECG_BEAT} ${ECG_DATA.replace(/^M/, "L")}`;

export default function HeroArt() {
  // Hovering a node lights up its wires (CSS :has(), progressive enhancement).
  const sys = styles.system;
  const hoverCss = nodes
    .map(
      (n) =>
        `.${sys}:has([data-node="${n.id}"]:hover) [data-edge~="${n.id}"]{opacity:1;stroke-width:1.8}` +
        `.${sys}:has([data-node="${n.id}"]:hover) [data-node="${n.id}"] .${styles.dot}{transform:scale(1.25)}`
    )
    .join("");

  return (
    <>
      <svg className={`${styles.system} ${styles.constellation}`} viewBox="0 0 600 600" aria-hidden="true">
        <style>{hoverCss}</style>

        {RING_RADII.slice(1).map((r) => (
          <circle key={r} className={styles.ring} cx={C} cy={C} r={r} />
        ))}

        {/* Ephemeris nod: one slow body still orbits the outer ring */}
        <g className={styles.orbit}>
          <circle className={styles.body} cx={C} cy={C - RING_RADII[3]} r="5" />
        </g>

        <g>
          {wires.map((w) => (
            <path
              key={w.i}
              d={w.d}
              data-edge={`${w.from} ${w.to}`}
              className={`${styles.wire} ${w.kind === "work" ? styles.work : styles.project}`}
            />
          ))}
        </g>

        <g className={styles.packets}>
          {wires.map((w) => (
            <g key={w.i}>
              <circle r="3" opacity={0} className={w.kind === "work" ? styles.packetWork : styles.packetProject}>
                <set attributeName="opacity" to="1" begin={`${w.i * 0.6}s`} fill="freeze" />
                <animateMotion dur={`${3.4 + (w.i % 3) * 0.9}s`} begin={`${w.i * 0.6}s`} repeatCount="indefinite" path={w.d} />
              </circle>
              {w.both && (
                <circle r="3" opacity={0} className={styles.packetWork}>
                  <set attributeName="opacity" to="1" begin={`${1.5 + w.i * 0.6}s`} fill="freeze" />
                  <animateMotion
                    dur={`${4 + (w.i % 2)}s`}
                    begin={`${1.5 + w.i * 0.6}s`}
                    repeatCount="indefinite"
                    path={w.d}
                    keyPoints="1;0"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              )}
            </g>
          ))}
        </g>

        <g>
          {nodes.map((n) => {
            const p = pos[n.id];
            const left = p.x < C || n.kind === "me";
            const label = (
              <>
                <circle className={styles.halo} cx={p.x} cy={p.y} r={n.kind === "me" ? 18 : 12} />
                <circle
                  className={`${styles.dot} ${styles[n.kind]}`}
                  cx={p.x}
                  cy={p.y}
                  r={n.kind === "me" ? 8 : 5}
                  style={{ transformOrigin: `${f(p.x)}px ${f(p.y)}px` }}
                />
                <text
                  className={styles.label}
                  x={n.kind === "me" ? p.x : left ? p.x - 14 : p.x + 14}
                  y={n.kind === "me" ? p.y + 32 : p.y + 4}
                  textAnchor={n.kind === "me" ? "middle" : left ? "end" : "start"}
                >
                  {n.label}
                </text>
              </>
            );
            return n.href ? (
              <a key={n.id} href={n.href} data-node={n.id} tabIndex={-1} className={styles.node}>
                {label}
              </a>
            ) : (
              <g key={n.id} data-node={n.id} className={styles.node}>
                {label}
              </g>
            );
          })}
        </g>
      </svg>

      <svg className={styles.ecg} viewBox="0 0 1200 60" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        {/* <title> must hold a single string, or React reports a hydration mismatch */}
        <title>{`A heartbeat that turns into data. The bits spell "${SECRET}".`}</title>
        <path className={`${styles.trace} ${styles.beat}`} d={ECG_BEAT} pathLength={1} />
        <path className={`${styles.trace} ${styles.data}`} d={ECG_DATA} pathLength={1} />
        <g className={styles.packets}>
          <circle r="3.5" opacity={0} className={styles.blip}>
            <set attributeName="opacity" to="1" begin="2.8s" fill="freeze" />
            <animateMotion dur="9s" begin="2.8s" repeatCount="indefinite" path={ECG_FULL} />
          </circle>
        </g>
      </svg>
    </>
  );
}
