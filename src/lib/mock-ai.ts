import type { Cleaned, Decision, Handoff } from "./types";

/**
 * Stand-ins for the Claude calls. Same function names and return shapes
 * will be used by the server routes in plan step 4, so the UI won't change.
 */

export function cleanupNotes(text: string): Cleaned {
  const out: Cleaned = { done: [], prog: [], block: [], attn: [] };
  const parts = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const s of parts) {
    const l = s.toLowerCase();
    if (/block|stuck|cannot|can't|waiting on (legal|the vendor)/.test(l)) out.block.push(s);
    else if (/need|please|decide|confirm|\?|waiting on (you|me)/.test(l)) out.attn.push(s);
    else if (/in progress|half|started|still|draft|continu|wip/.test(l)) out.prog.push(s);
    else if (/finish|shipped|done|complete|fixed|sent|merged|released/.test(l)) out.done.push(s);
    else out.prog.push(s);
  }
  return out;
}

export interface Answer {
  text: string;
  sources: { kind: "Handoff" | "Decision"; date: string; by: string }[];
  found: boolean;
}

const STOP = new Set([
  "what", "did", "about", "last", "week", "that", "with", "from", "this",
  "have", "right", "now", "were", "does", "the", "and", "for",
]);

export function answerQuestion(
  question: string,
  handoffs: Handoff[],
  decisions: Decision[],
): Answer {
  const words = (question.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((w) => !STOP.has(w));

  const corpus = [
    ...handoffs.map((h) => ({ kind: "Handoff" as const, date: h.date, by: h.author, text: h.raw })),
    ...decisions.map((d) => ({
      kind: "Decision" as const,
      date: d.date,
      by: d.who,
      text: `${d.decision}. Reason: ${d.reason}`,
    })),
  ];

  if (words.length === 0) {
    return { text: "Ask about a decision, a handoff, or a teammate.", sources: [], found: false };
  }

  const scored = corpus
    .map((it) => {
      const t = it.text.toLowerCase();
      const score = words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
      return { it, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    return {
      text: "We couldn't find that in our handoffs or decisions. Try different words, or log it in the Decision Log.",
      sources: [],
      found: false,
    };
  }

  const top = scored[0].it;
  const text =
    top.kind === "Decision"
      ? `The closest decision is from ${top.date}: ${top.text}.`
      : `The closest note is ${top.by}'s handoff from ${top.date}: ${top.text}`;

  return {
    text,
    sources: scored.map((s) => ({ kind: s.it.kind, date: s.it.date, by: s.it.by })),
    found: true,
  };
}
