"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { HandoffPanel } from "./HandoffPanel";
import { DecisionPanel } from "./DecisionPanel";
import { AskPanel } from "./AskPanel";
import { Footer } from "./Footer";
import { SAMPLE_STORE } from "@/lib/sample-data";
import type { Store } from "@/lib/types";

// Plan step 2 replaces this with API calls to /api/handoffs and /api/decisions.
const STORAGE_KEY = "handoff-log-proto-v2";
const TABS = [
  { id: "handoff", label: "Today's Handoff" },
  { id: "decisions", label: "Decision Log" },
  { id: "ask", label: "Ask Our Notes" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function HandoffApp() {
  const [store, setStore] = useState<Store>(SAMPLE_STORE);
  const [tab, setTab] = useState<TabId>("handoff");
  const [loaded, setLoaded] = useState(false);

  // Load saved data after mount (per-browser only, temporary).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw) as Store);
    } catch {
      /* ignore: fall back to sample data */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* ignore */
    }
  }, [store, loaded]);

  function onTabKey(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  }

  return (
    <>
      <Header />

      <div className="tabs-wrap">
        <div className="tabs" role="tablist" aria-label="Sections">
          {TABS.map((t, i) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                className="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="wrap">
        <section
          id="panel-handoff"
          role="tabpanel"
          aria-labelledby="tab-handoff"
          hidden={tab !== "handoff"}
          className="panel"
        >
          <HandoffPanel
            handoffs={store.handoffs}
            onSave={(h) => setStore((s) => ({ ...s, handoffs: [...s.handoffs, h] }))}
          />
        </section>

        <section
          id="panel-decisions"
          role="tabpanel"
          aria-labelledby="tab-decisions"
          hidden={tab !== "decisions"}
          className="panel"
        >
          <DecisionPanel
            decisions={store.decisions}
            onAdd={(d) => setStore((s) => ({ ...s, decisions: [...s.decisions, d] }))}
          />
        </section>

        <section
          id="panel-ask"
          role="tabpanel"
          aria-labelledby="tab-ask"
          hidden={tab !== "ask"}
          className="panel"
        >
          <AskPanel handoffs={store.handoffs} decisions={store.decisions} />
        </section>
      </main>

      <Footer />
    </>
  );
}
