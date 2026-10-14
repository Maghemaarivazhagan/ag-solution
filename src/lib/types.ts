export type Person = "Maghema R A" | "Ashok";

export interface Cleaned {
  done: string[];
  prog: string[];
  block: string[];
  attn: string[];
}

export interface Handoff {
  id: string;
  date: string; // YYYY-MM-DD
  author: Person;
  raw: string;
  cleaned: Cleaned | null;
}

export interface Decision {
  id: string;
  date: string; // YYYY-MM-DD
  decision: string;
  reason: string;
  who: Person;
}

export interface Store {
  handoffs: Handoff[];
  decisions: Decision[];
}
