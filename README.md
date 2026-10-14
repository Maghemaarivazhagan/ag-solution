# Handoff Log

A small shared site where two teammates in different countries write end-of-day handoffs, record decisions, and ask questions about past notes.

This is the Next.js port of the approved prototype. It runs on sample data, and the Claude features are mocked (see `src/lib/mock-ai.ts`).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

vercel deployment https://vercel.com/maghemaarivazhagan36-1449s-projects/ag-solution/A5w57XC2JjanPaymEPHJfmSgvorZ

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Project layout

```
src/
  app/            Next.js routes (page.tsx, layout.tsx)
  components/     Header, HandoffApp (tabs and state), HandoffPanel, DecisionPanel, AskPanel, Footer
  lib/
    types.ts          Shared data types
    sample-data.ts    Demo data (replaced by the database in step 2)
    mock-ai.ts        Stand-ins for the Claude calls (replaced by server routes in step 4)
    format.ts         Date, clock, and id helpers
  styles/globals.css  Design tokens and all styles, including dark mode
docs/
  handoff-log.html    Approved prototype, kept as a visual and behavior reference
```

## Where we are in the plan

- [x] Step 1: Next.js project scaffolded
- [x] Port the prototype into components (this step)
- [ ] Step 2: Replace local storage with API routes and a database (Firestore or SQLite)
- [ ] Step 3: Shared password check in middleware
- [ ] Step 4: Server routes for cleanup and questions, calling the Claude API
- [ ] Step 5: Tests, Lighthouse, CI with secret scanning, deploy

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`.

- `ANTHROPIC_API_KEY`: used only by server routes (step 4)
- `SITE_PASSWORD`: shared password for the two teammates (step 3)

## Rules

- No client data, passwords, or personal details in notes.
- Confirm with the manager which company information may be sent to Claude before step 4 goes live.
- Run secret scanning and never commit API keys.
