"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ATTEMPT_LIMIT,
  OPENING,
  TURN_SECONDS,
  frame,
  isValidGuess,
  players,
  randomCode,
  score,
  type Counters,
  type Frame,
} from "@/lib/codebreaker";
import styles from "./ProtocolInspector.module.css";

type Game = { turnId: number; attempts: Counters; over: boolean };
const NEW_GAME: Game = { turnId: 1, attempts: [0, 0], over: false };
const BYTES_PER_ROW = 8;

const hex = (b: number) => b.toString(16).padStart(2, "0");
const feedback = (r: { correct: number; wrong: number }) =>
  `${r.correct} right place · ${r.wrong} wrong place`;

// Plays CodeBreaker against a random-guessing opponent and shows every frame
// Player 1's client would send or receive, down to the bytes.
export default function ProtocolInspector() {
  const [frames, setFrames] = useState<Frame[]>(OPENING);
  const [selected, setSelected] = useState(OPENING.length - 1);
  const [view, setView] = useState<"wire" | "json">("wire");
  const [guess, setGuess] = useState("");
  const [game, setGame] = useState<Game>(NEW_GAME);
  const secret = useRef("");
  const logRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [frames.length]);

  const commit = (next: Frame[], nextGame: Game) => {
    setFrames((f) => [...f, ...next]);
    setSelected(frames.length + next.length - 1);
    setGame(nextGame);
    setGuess("");
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (game.over || !guess) return;
    const { turnId } = game;
    let [mine, theirs] = game.attempts;
    const next: Frame[] = [frame("out", { msg_type: "MOVE", payload: { guess, turn_id: turnId } })];

    if (!isValidGuess(guess)) {
      next.push(
        frame(
          "in",
          {
            msg_type: "ERROR",
            payload: {
              code: "INVALID_GUESS",
              message: "Guess must be four unique digits from 0-9.",
              turn_id: turnId,
            },
          },
          "rejected"
        )
      );
      return commit(next, game);
    }

    if (!secret.current) secret.current = randomCode();
    const code = secret.current;

    const gameOver = (winner: 1 | 2 | null, finalGuess: string) =>
      frame(
        "in",
        {
          msg_type: "GAME_OVER",
          payload: {
            outcome: winner ? "WIN" : "DRAW",
            winner,
            reason: winner ? "CODE_SOLVED" : "ATTEMPTS_EXHAUSTED",
            secret_code: code,
            final_guess: finalGuess,
            players: players([mine, theirs]),
            message:
              winner === 1 ? "You cracked the code." : winner === 2 ? "Opponent cracked the code." : "You both lose.",
          },
        },
        winner === 1 ? "you win!" : winner === 2 ? "opponent wins" : "draw"
      );

    const update = (prev: 1 | 2, g: string, r: { correct: number; wrong: number }, turn: number) => ({
      msg_type: "STATE_UPDATE",
      payload: {
        event: "GUESS_RESULT",
        previous_player: prev,
        guess: g,
        correct_position: r.correct,
        wrong_position: r.wrong,
        players: players([mine, theirs]),
        active_player: prev === 1 ? 2 : 1,
        turn_id: turn,
        turn_seconds: TURN_SECONDS,
      },
    });

    // Your turn
    mine++;
    const yours = score(code, guess);
    if (yours.correct === 4) {
      next.push(gameOver(1, guess));
      return commit(next, { turnId, attempts: [mine, theirs], over: true });
    }
    next.push(frame("in", update(1, guess, yours, turnId + 1), feedback(yours)));

    // Opponent's turn: you only see the server's broadcast, never their MOVE.
    theirs++;
    const theirGuess = randomCode();
    const r = score(code, theirGuess);
    if (r.correct === 4) {
      next.push(gameOver(2, theirGuess));
      return commit(next, { turnId: turnId + 1, attempts: [mine, theirs], over: true });
    }
    next.push(frame("in", update(2, theirGuess, r, turnId + 2), `opponent · ${feedback(r)}`));

    const exhausted = mine >= ATTEMPT_LIMIT;
    if (exhausted) next.push(gameOver(null, theirGuess));
    commit(next, { turnId: turnId + 2, attempts: [mine, theirs], over: exhausted });
  };

  const reset = () => {
    secret.current = "";
    setFrames(OPENING);
    setSelected(OPENING.length - 1);
    setGame(NEW_GAME);
    setGuess("");
  };

  const current = frames[Math.min(selected, frames.length - 1)];
  const payloadLength = current.bytes.length - 4;
  const rows: number[] = [];
  for (let o = 0; o < current.bytes.length; o += BYTES_PER_ROW) rows.push(o);

  return (
    <div className={styles.inspector}>
      <div className={styles.bar}>
        <span />
        <span />
        <span />
        <em>codebreaker · wire inspector</em>
      </div>

      <form className={styles.controls} onSubmit={send}>
        <label htmlFor="cb-guess">guess</label>
        <input
          id="cb-guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0123"
          disabled={game.over}
        />
        {game.over ? (
          <button type="button" onClick={reset}>
            New game
          </button>
        ) : (
          <button type="submit" disabled={!guess}>
            Send MOVE
          </button>
        )}
      </form>
      <p className={styles.status}>
        turn {game.turnId} · attempts {game.attempts[0]}/{ATTEMPT_LIMIT} · crack 4 unique digits
      </p>

      <ol ref={logRef} className={styles.log} aria-label="Frames">
        {frames.map((f, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={i === selected}
              className={i === selected ? styles.selected : undefined}
              onClick={() => setSelected(i)}
            >
              <span className={f.dir === "out" ? styles.out : styles.in}>{f.dir === "out" ? "→" : "←"}</span>
              <span className={styles.type}>{f.msg.msg_type}</span>
              <span className={styles.size}>{f.bytes.length} B</span>
              {f.note && <span className={styles.note}>{f.note}</span>}
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.detail}>
        <div className={styles.tabs} role="group" aria-label="Frame view">
          <button type="button" aria-pressed={view === "wire"} onClick={() => setView("wire")}>
            wire bytes
          </button>
          <button type="button" aria-pressed={view === "json"} onClick={() => setView("json")}>
            json
          </button>
        </div>

        {view === "wire" ? (
          <div className={styles.hex} aria-label={`Hex dump, ${current.bytes.length} bytes`}>
            {rows.map((o) => {
              const row = Array.from(current.bytes.slice(o, o + BYTES_PER_ROW));
              return (
                <div key={o} className={styles.row}>
                  <span className={styles.offset}>{o.toString(16).padStart(4, "0")}</span>
                  <span className={styles.bytes}>
                    {row.map((b, i) => (
                      <span key={i} className={o + i < 4 ? styles.header : undefined}>
                        {hex(b)}
                      </span>
                    ))}
                  </span>
                  <span className={styles.ascii}>
                    {row.map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : ".")).join("")}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <pre className={styles.json}>{JSON.stringify(current.msg, null, 2)}</pre>
        )}

        <p className={styles.legend}>
          <span className={styles.header}>
            {Array.from(current.bytes.slice(0, 4), hex).join(" ")}
          </span>{" "}
          = {payloadLength}-byte UTF-8 JSON payload, big-endian length prefix
        </p>
      </div>
    </div>
  );
}
