"use client";

import { useEffect, useRef, useState } from "react";
import { answerQuestion, type Answer } from "@/lib/mock-ai";
import { fmtDate } from "@/lib/format";
import type { Decision, Handoff } from "@/lib/types";

const EXAMPLES = [
  { label: "Invoice format decision", q: "What did we decide about the invoice format?" },
  { label: "What's blocked?", q: "What is blocked right now?" },
  { label: "What needs attention?", q: "What needs my attention?" },
];

interface Props {
  handoffs: Handoff[];
  decisions: Decision[];
}

export function AskPanel({ handoffs, decisions }: Props) {
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function ask(q: string) {
    setAsking(true);
    // Stand-in for the server route in plan step 4 (Claude API).
    timer.current = setTimeout(() => {
      setAnswer(answerQuestion(q, handoffs, decisions));
      setAsking(false);
    }, 900);
  }

  return (
    <>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Questions</p>
          <h2 style={{ marginTop: 6 }}>Ask Our Notes</h2>
          <p className="lead">Answers come only from our saved handoffs and decisions. If the notes don&apos;t say, we&apos;ll tell you.</p>
        </div>
        <span className="badge">Answers are a preview</span>
      </div>

      <div className="card">
        <div className="field">
          <label htmlFor="q-text">What do you want to know?</label>
          <input
            id="q-text"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                ask(question);
              }
            }}
            placeholder="What did we decide about the invoice format last week?"
          />
        </div>
        <div className="actions">
          <button type="button" className={`btn${asking ? " loading" : ""}`} onClick={() => ask(question)} disabled={asking} aria-busy={asking}>
            <span className="spinner" aria-hidden="true" />
            {asking ? "Looking…" : "Ask our notes"}
          </button>
        </div>
        <div className="chips">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setQuestion(ex.q);
                ask(ex.q);
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div aria-live="polite">
          {answer && (
            <div className="answer">
              <div className="label">{answer.found ? "Answer (preview)" : "Answer"}</div>
              <p className="ink">{answer.text}</p>
              {answer.sources.length > 0 && (
                <>
                  <p style={{ marginTop: 12, fontWeight: 600 }}>Sources</p>
                  <ul className="sources">
                    {answer.sources.map((s, i) => (
                      <li key={i}>
                        {s.kind}, {fmtDate(s.date)}, {s.by}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
