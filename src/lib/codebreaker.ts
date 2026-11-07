// A browser-side model of the CodeBreaker wire protocol, following
// github.com/ABowSEC/CS457-CodeBreaker/blob/main/docs/protocol_blueprint.md:
// each message is UTF-8 JSON preceded by a 4-byte unsigned big-endian length.

export type Message = { msg_type: string; payload: Record<string, unknown> };

export type Frame = {
  dir: "out" | "in";
  msg: Message;
  /** The exact bytes on the wire: length header + payload. */
  bytes: Uint8Array;
  note?: string;
};

export const CODE_LENGTH = 4;
export const ATTEMPT_LIMIT = 10;
export const TURN_SECONDS = 120;

export function encode(msg: Message): Uint8Array {
  const body = new TextEncoder().encode(JSON.stringify(msg));
  const out = new Uint8Array(4 + body.length);
  new DataView(out.buffer).setUint32(0, body.length, false); // big-endian
  out.set(body, 4);
  return out;
}

export function frame(dir: Frame["dir"], msg: Message, note?: string): Frame {
  return { dir, msg, bytes: encode(msg), note };
}

/** Four unique ASCII digits, leading zeros allowed. */
export function isValidGuess(guess: string): boolean {
  return /^\d{4}$/.test(guess) && new Set(guess).size === CODE_LENGTH;
}

export function score(secret: string, guess: string) {
  let correct = 0;
  let wrong = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) correct++;
    else if (secret.includes(guess[i])) wrong++;
  }
  return { correct, wrong };
}

export function randomCode(): string {
  const digits = "0123456789".split("");
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, CODE_LENGTH).join("");
}

export type Counters = [number, number];

export function players(attempts: Counters) {
  return attempts.map((attempt_count, i) => ({
    player_number: i + 1,
    attempt_count,
    miss_turn: 0,
  }));
}

/** What Player 1's client sees before the first move. */
export const OPENING: Frame[] = [
  frame("out", { msg_type: "CONNECT", payload: { alias: "guest" } }),
  frame("in", {
    msg_type: "LOBBY_WAIT",
    payload: { player_number: 1, alias: "guest", message: "Waiting for Player 2." },
  }),
  frame(
    "in",
    {
      msg_type: "GAME_START",
      payload: {
        player_number: 1,
        players: [
          { player_number: 1, alias: "guest" },
          { player_number: 2, alias: "opponent" },
        ],
        active_player: 1,
        code_length: CODE_LENGTH,
        attempt_limit: ATTEMPT_LIMIT,
        turn_seconds: TURN_SECONDS,
        turn_id: 1,
      },
    },
    "opponent joined"
  ),
];
