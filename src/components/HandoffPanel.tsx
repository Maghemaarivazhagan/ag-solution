"use client";

import { useEffect, useRef, useState } from "react";
import { cleanupNotes } from "@/lib/mock-ai";
import { fmtDate, uid } from "@/lib/format";
import type { Cleaned, Handoff, Person } from "@/lib/types";

const PEOPLE: Person[] = ["Maghema R A", "Ashok"];
const CATS = [
  { key: "done", label: "Done", cls: "done", empty: "Nothing finished yet" },
  { key: "prog", label: "In progress", cls: "prog", empty: "Nothing in progress" },
  { key: "block", label: "Blocked", cls: "block", empty: "Nothing blocked" },
  { key: "attn", label: "Needs your attention", cls: "attn", empty: "Nothing needs attention" },
] as const;

interface Props {
  handoffs: Handoff[];
  onSave: (h: Handoff) => void;
}

export function HandoffPanel({ handoffs, onSave: saveHandoff }: Props) {
  const [author, setAuthor] = useState<Person>(PEOPLE[0]);
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<{ text: string; cleaned: Cleaned } | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending cleanup timer if the component unmounts.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function onChangeText(v: string) {
    setText(v);
    if (result) setResult(null); // cleaned summary is for the old text
  }

  function onClean() {
    const t = text.trim();
    if (!t) {
      setError("Add a few notes first, then clean them up.");
      textRef.current?.focus();
      return;
    }
    setError("");
    setCleaning(true);
    // Stand-in for the server route in plan step 4 (Claude API).
    timer.current = setTimeout(() => {
      setResult({ text: t, cleaned: cleanupNotes(t) });
      setCleaning(false);
    }, 900);
  }

  function onSave() {
    const t = text.trim();
    if (!t) {
      setError("Add some notes before saving.");
      textRef.current?.focus();
      return;
    }
    setError("");
    saveHandoff({
      id: uid("h"),
      date,
      author,
      raw: t,
      cleaned: result && result.text === t ? result.cleaned : cleanupNotes(t),
    });
    setText("");
    setResult(null);
    setSaveMsg("Saved. Your teammate can see it now.");
  }

  const sorted = [...handoffs].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <div className="panel-head">
        <div>
          <p className="eyebrow">End of day</p>
          <h2 style={{ marginTop: 6 }}>Today&apos;s Handoff</h2>
          <p className="lead">Jot down what happened today. We&apos;ll sort it into a clear summary for your teammate.</p>
        </div>
        <span className="badge">Cleanup is a preview</span>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="h-author">Who&apos;s writing?</label>
            <select id="h-author" value={author} onChange={(e) => setAuthor(e.target.value as Person)}>
              {PEOPLE.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="h-date">Date</label>
            <input id="h-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field wide">
            <label htmlFor="h-text">Your rough notes</label>
            <textarea
              id="h-text"
              ref={textRef}
              value={text}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder="e.g. Finished the reminder fix. Waiting on you to confirm the tax line. Blocked on the vendor NDA."
            />
          </div>
        </div>

        <div className="actions">
          <button type="button" className={`btn${cleaning ? " loading" : ""}`} onClick={onClean} disabled={cleaning} aria-busy={cleaning}>
            <span className="spinner" aria-hidden="true" />
            {cleaning ? "Cleaning up…" : "Clean up my notes"}
          </button>
        </div>
        <p className="error" role="alert">{error}</p>

        {result && (
          <div className="cleanup">
            <h3 className="cleanup-title">Your tidy summary</h3>
            <div className="cards">
              {CATS.map((c) => {
                const items = result.cleaned[c.key];
                return (
                  <div key={c.key} className={`cat ${c.cls}`}>
                    <h3>{c.label}</h3>
                    <ul>
                      {items.length ? items.map((i, n) => <li key={n}>{i}</li>) : <li className="none">{c.empty}</li>}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="save-row">
              <button type="button" className="btn" onClick={onSave}>Save handoff</button>
              <span className="status" role="status">{saveMsg}</span>
            </div>
          </div>
        )}
      </div>

      <div className="sub-head">
        <h3>Saved handoffs</h3>
        <span className="count">{handoffs.length ? `${handoffs.length} saved` : ""}</span>
      </div>
      <div className="list" aria-live="polite">
        {sorted.length === 0 ? (
          <div className="empty">
            <strong>No handoffs yet</strong>
            Write your first note above, then save it here for your teammate.
          </div>
        ) : (
          sorted.map((h) => (
            <article className="item" key={h.id}>
              <div className="item-meta">
                <span className="chip">{h.author}</span>
                <span>{fmtDate(h.date)}</span>
              </div>
              <div className="body">{h.raw}</div>
              {h.cleaned && (
                <div className="mini">
                  {CATS.filter((c) => h.cleaned![c.key].length).map((c) => (
                    <div key={c.key}>
                      <b>{c.label}:</b> {h.cleaned![c.key].join(" ")}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}
