"use client";

import { useState } from "react";
import { fmtDate, uid } from "@/lib/format";
import type { Decision, Person } from "@/lib/types";

const PEOPLE: Person[] = ["Maghema R A", "Ashok"];

interface Props {
  decisions: Decision[];
  onAdd: (d: Decision) => void;
}

export function DecisionPanel({ decisions, onAdd }: Props) {
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [who, setWho] = useState<Person>(PEOPLE[0]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const d = decision.trim();
    const r = reason.trim();
    if (!d || !r) {
      setError("Add both what you decided and why.");
      return;
    }
    setError("");
    onAdd({ id: uid("d"), date, decision: d, reason: r, who });
    setDecision("");
    setReason("");
  }

  const q = query.trim().toLowerCase();
  const rows = decisions
    .filter((d) => !q || `${d.decision} ${d.reason} ${d.who}`.toLowerCase().includes(q))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Record</p>
          <h2 style={{ marginTop: 6 }}>Decision Log</h2>
          <p className="lead">Write down what you decided, why, and who made the call, so it&apos;s easy to find later.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <div className="field wide">
              <label htmlFor="d-decision">What did you decide?</label>
              <input id="d-decision" type="text" value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="e.g. Invoices go out as PDF from the new template" />
            </div>
            <div className="field wide">
              <label htmlFor="d-reason">Why?</label>
              <input id="d-reason" type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="The main reason for this choice" />
            </div>
            <div className="field">
              <label htmlFor="d-date">Date</label>
              <input id="d-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="d-who">Who decided?</label>
              <select id="d-who" value={who} onChange={(e) => setWho(e.target.value as Person)}>
                {PEOPLE.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="btn">Log this decision</button>
          </div>
          <p className="error" role="alert">{error}</p>
        </form>
      </div>

      <div className="search">
        <label htmlFor="d-search">Search decisions</label>
        <input id="d-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try a word like invoice or standup" />
      </div>
      <p className="search-count">
        {q ? `${rows.length} of ${decisions.length} match` : decisions.length ? `${decisions.length} recorded` : ""}
      </p>

      <div className="list" aria-live="polite">
        {rows.length === 0 ? (
          <div className="empty">
            <strong>{q ? "No matches" : "No decisions yet"}</strong>
            {q ? "Try a shorter word, or clear the search to see every decision." : "Log the first decision above. Include the reason, so the team knows why."}
          </div>
        ) : (
          rows.map((d) => (
            <article className="item" key={d.id}>
              <div className="item-meta">
                <span>{fmtDate(d.date)}</span>
                <span className="chip">{d.who}</span>
              </div>
              <div className="title">{d.decision}</div>
              <div className="reason">Why: {d.reason}</div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
