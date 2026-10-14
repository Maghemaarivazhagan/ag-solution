import type { Store } from "./types";

// Demo data only. Replace with database reads in plan step 2.
export const SAMPLE_STORE: Store = {
  handoffs: [
    {
      id: "h1",
      date: "2026-10-12",
      author: "Ashok",
      raw: "Finished the invoice template v2. Waiting on you to confirm the tax line. Blocked on legal review for the vendor NDA. Started the Q4 metrics draft, about half done.",
      cleaned: {
        done: ["Finished the invoice template v2."],
        prog: ["Started the Q4 metrics draft, about half done."],
        block: ["Blocked on legal review for the vendor NDA."],
        attn: ["Waiting on you to confirm the tax line."],
      },
    },
    {
      id: "h2",
      date: "2026-10-13",
      author: "Maghema R A",
      raw: "Shipped the reminder email fix. Need Ashok to decide the invoice format before Friday. Dashboard data is still in progress.",
      cleaned: {
        done: ["Shipped the reminder email fix."],
        prog: ["Dashboard data is still in progress."],
        block: [],
        attn: ["Need Ashok to decide the invoice format before Friday."],
      },
    },
  ],
  decisions: [
    {
      id: "d1",
      date: "2026-10-10",
      decision: "Invoice format: send PDFs from the new template",
      reason: "The client asked for a consistent layout, and Word files kept breaking.",
      who: "Ashok",
    },
    {
      id: "d2",
      date: "2026-10-11",
      decision: "Move the daily standup to 9:30 IST",
      reason: "Gives the US a longer overlap in the morning.",
      who: "Maghema R A",
    },
    {
      id: "d3",
      date: "2026-10-13",
      decision: "Invoice numbers use INV-YYYY-### format",
      reason: "Makes the sequence easy to sort and audit.",
      who: "Ashok",
    },
  ],
};
