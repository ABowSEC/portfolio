import styles from "./TerminalPanel.module.css";

// Stand-in visual for NetSleuth until a real dashboard screenshot is added.
const rows = [
  ["192.168.1.1", "router", "ARP", "is-at 3c:84:6a…"],
  ["192.168.1.14", "laptop", "DNS", "github.com"],
  ["192.168.1.22", "phone", "mDNS", "_airplay._tcp.local"],
  ["192.168.1.31", "smart-tv", "DNS", "api.streaming…"],
  ["192.168.1.40", "unknown", "TCP", "→ 203.0.113.7:4444"],
];

export default function TerminalPanel() {
  return (
    <div className={styles.term} aria-hidden="true">
      <div className={styles.bar}>
        <span />
        <span />
        <span />
        <em>netsleuth · passive mode</em>
      </div>
      <pre className={styles.body}>
        <span className={styles.dim}>$ python main.py</span>
        {"\n"}
        <span className={styles.dim}>[*] listening… 0 packets sent</span>
        {"\n\n"}
        {rows.map(([ip, host, proto, detail], i) => (
          <span key={ip} className={i === rows.length - 1 ? styles.alert : undefined}>
            {ip.padEnd(14)}
            {host.padEnd(10)}
            {proto.padEnd(6)}
            {detail}
            {"\n"}
          </span>
        ))}
        {"\n"}
        <span className={styles.alert}>[!] anomaly score 0.91 · 192.168.1.40</span>
        <span className={styles.caret}>▍</span>
      </pre>
    </div>
  );
}
