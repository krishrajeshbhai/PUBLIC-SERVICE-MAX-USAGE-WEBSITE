# TransitOne — Implementation Plan (2 of 2: FRONTEND)
### For Engineer 2 — Frontend, UX & Map

> **This is a paired document.** Its twin is `engineer-1-backend-plan.md`, held by the other engineer. **Part A below is identical, word-for-word, in both documents.** If anything in Part A needs to change during the hackathon, update it in *both* files and tell your teammate immediately — Part A is the contract that keeps your two halves compatible. Part B is yours alone.

---

# PART A — SHARED FOUNDATION
*(identical in both documents — do not edit unilaterally)*

## A1. The Pitch

> **TransitOne turns "how do I get from A to B" into one search, one ticket, and one wallet — across bus, metro, and walking — and automatically re-plans your trip the moment something goes wrong.**

## A2. Feature Scope

| Bucket | Features | Why |
|---|---|---|
| **MVP (must-have, ~32 hrs)** | 1) Multi-modal journey search returning 3–4 ranked options (fastest / cheapest / least-walking) · 2) One unified itinerary + one ticket ID · 3) Mobility wallet (single balance, auto-deducted) · 4) Live delay simulation that triggers automatic re-routing · 5) Basic crowd indicator (🟢🟡🔴) per line | Smallest feature set that still proves the actual differentiator: one search, one ticket, adapts in real time. |
| **Stretch (~10 hrs, only after MVP works end-to-end)** | 6) Accessibility filter (least-walking / no-stairs) · 7) Eco-impact (CO₂ saved) display · 8) Simple gamification badge · 9) Mini city-analytics view (mocked) | Cheap to layer on top of the MVP engine; gestures at the bigger Passenger/Operator/City vision. |
| **Explicitly out of scope** (mention in pitch as roadmap, do not build) | Real payments, community incident reporting, family accounts, tourist mode, employer/college shuttle integration, cross-city accounts, on-demand shuttle pooling, real safety-score ML, live GPS vehicle tracking | Needs data partnerships, payment integration, or ML pipelines not feasible in 48 hours. Naming these explicitly in the pitch shows deliberate scoping. |

**Demo dataset:** a small fictional/representative city (~15–20 stops, 2 metro lines + 2 bus lines + walking edges) — enough for 2–3 genuinely different route options between fixed origin/destination pairs. Do not try to model a whole real city.

## A3. System Architecture

```
                        ┌─────────────────────────┐
                        │   React Frontend (SPA)   │
                        │  Search / Results / Live │
                        │  Journey / Wallet views  │
                        └────────────┬─────────────┘
                                     │ REST (JSON) + polling
                                     │ (WebSocket optional upgrade)
                        ┌────────────▼─────────────┐
                        │   Node.js / Express API   │
                        │  ┌─────────────────────┐  │
                        │  │ Journey Planner      │  │  <- graph search over
                        │  │ (graph + weights)    │  │     stops/lines/walk edges
                        │  ├─────────────────────┤  │
                        │  │ Ticket & Wallet svc  │  │
                        │  ├─────────────────────┤  │
                        │  │ Delay & Reroute svc  │  │
                        │  ├─────────────────────┤  │
                        │  │ Crowd & Eco calc     │  │
                        │  └─────────────────────┘  │
                        └────────────┬─────────────┘
                                     │
                        ┌────────────▼─────────────┐
                        │  Persistence (lowdb JSON  │
                        │  file or SQLite)          │
                        │  stops, lines, tickets,   │
                        │  wallets, active journeys │
                        └───────────────────────────┘
```

**Why lowdb/SQLite, not a real DB server:** zero setup time, survives server restarts (a demo crash doesn't lose wallet/ticket state), trivial to seed. Don't spend hackathon time on Postgres/Mongo infra.

## A4. Shared Data Model
*(exact field names — both sides must use these)*

```
Stop        { id, name, lat, lng }
Line        { id, name, mode: "bus"|"metro", color, stopIds: [ordered Stop.id] }
WalkEdge    { fromStopId, toStopId, distanceMeters, minutes }
Segment     { mode: "bus"|"metro"|"walk", lineId?, fromStopId, toStopId, minutes, cost, crowdLevel }
JourneyOption {
  id, type: "fastest"|"cheapest"|"least_walking"|"accessible",
  totalMinutes, totalCost, totalWalkMeters, co2SavedGrams,
  segments: [Segment]
}
Ticket      { id, journeyOptionId, userId, status: "active"|"completed"|"rerouted", createdAt }
WalletTxn   { id, userId, amount, ticketId, timestamp }
Wallet      { userId, balance }
DelayEvent  { id, segmentKey (lineId+fromStopId+toStopId), delayMinutes, createdAt }
```

## A5. API Contract
*(locked in Hour 0–2; do not change without updating this section in both documents and notifying your teammate)*

| Method & Path | Purpose | Request body | Response body |
|---|---|---|---|
| `GET /api/stops` | List all stops (search autocomplete + map) | – | `[Stop]` |
| `POST /api/journeys/search` | Get ranked journey options | `{ originStopId, destinationStopId, prefs?: { accessible?: bool } }` | `{ options: [JourneyOption] }` |
| `POST /api/tickets/book` | Book one journey option, deduct wallet | `{ userId, journeyOptionId }` | `{ ticket: Ticket, walletBalance: number }` |
| `GET /api/wallet/:userId` | Get balance + history | – | `{ balance, transactions: [WalletTxn] }` |
| `GET /api/tickets/:ticketId/live` | Poll every 5s during "live journey" view | – | `{ status, currentSegmentIndex, alert?: string, rerouted?: JourneyOption }` |
| `POST /api/simulate/delay` | **Demo trigger button** — injects a delay on a segment | `{ lineId, fromStopId, toStopId, delayMinutes }` | `{ affectedTicketIds: [string] }` |
| `GET /api/lines/:lineId/crowd` | Crowd level for a line | – | `{ crowdLevel: "green"|"yellow"|"red" }` |

**Parallel-work rule:** you do not wait for the backend to be live. Build a `mockApi.js` returning hardcoded objects in these exact shapes, build the whole UI against it, then swap the base URL once the real endpoints are ready. Your job is to make sure every screen consumes exactly these shapes so the swap is a one-line change.

## A6. 48-Hour Timeline & Sync Checkpoints

| Time | Backend (Engineer 1) | Frontend (Engineer 2) | Sync checkpoint |
|---|---|---|---|
| Hr 0–2 | **Together:** finalize API contract & data model. Scaffold Express project. | **Together:** same. Scaffold Vite + React project. | ✅ Contract signed off before splitting up |
| Hr 2–10 | Seed data + graph builder + basic "fastest route" search | Scaffold pages against mock API | — |
| Hr 10–20 | Add "cheapest" & "least-walking" ranking; ticket booking + wallet endpoints; persistence wired up | Wire real search + results screen to backend; build map view | **✅ Checkpoint A:** search → results → book ticket works end-to-end |
| Hr 20–30 | Delay simulation endpoint + reroute logic; live status polling endpoint | Live Journey view (polling), delay alert banner, "trigger delay" demo button | **✅ Checkpoint B:** simulate delay → frontend shows reroute live |
| Hr 30–40 | Crowd + eco-impact calc; accessibility filter; harden edge cases | Wallet/profile page; crowd + eco UI; accessibility toggle; visual polish | **✅ Checkpoint C:** all MVP features integrated |
| Hr 40–46 | Stretch features if time allows; bug bash together | Stretch UI; bug bash together | **✅ Checkpoint D:** full run-through, no known crashes |
| Hr 46–48 | Buffer + demo rehearsal | Buffer + demo rehearsal + slides | Final dry run |

Run the checkpoints for real — the actual demo flow together, not just "my part works."

## A7. Demo Script (3–4 minutes)

1. **Problem (20s):** commuters juggle 3 apps and no ticket to get from A to B — this is one layer for all of it.
2. **Search (30s):** Search Home → Office. Show 3 ranked options — point out they use different combinations of bus/metro/walking.
3. **Book (20s):** Tap the fastest option → one unified ticket, one wallet deduction shown.
4. **The differentiator (60–90s):** Open Live Journey view. Hit "Simulate Delay." Watch the app detect the delay affects the planned connection and auto-recompute a new route live. Narrate this moment slowly and clearly.
5. **Depth (30s):** Show crowd indicator, CO₂-saved badge, accessibility toggle.
6. **Vision close (20–30s):** Show the Passenger/Operator/City layer diagram and say what's next — signals deliberate scoping, not running out of time.

## A8. Risks & Fallbacks

| Risk | Fallback |
|---|---|
| Reroute logic gets buggy under time pressure | Fall back to a scripted/deterministic delay scenario (one specific segment, one pre-computed reroute) for the demo — still looks live to judges. |
| Map integration eats too much time | Ship without the map; the itinerary timeline + cards alone still tell the story. |
| WebSockets under-time | Stick to polling every 5s — invisible to judges, far less risk than debugging sockets live. |
| Persistence library friction | `lowdb` (pure JSON file) is safer than SQLite if either engineer is unfamiliar with SQL — zero schema, just read/write JS objects. |

---

# PART B — YOUR PLAN: FRONTEND (Engineer 2)

## B1. What you own

The React SPA, the map, and every user-facing screen — including how real-time updates (delays/reroutes) get shown to the user. You will build against **A4/A5 exactly**, using a local mock before the real backend exists, so you're never blocked waiting on Engineer 1.

## B2. Recommended stack

React (Vite), plain CSS or Tailwind, `leaflet` + `react-leaflet` with OpenStreetMap tiles (free, no API key needed — important for a hackathon).

## B3. Task list, in order

1. **Project setup** — Vite + React, React Router, a `services/api.js` file with functions matching every contract endpoint in A5. Start with a `mockApi.js` returning hardcoded contract-shaped data so you're never blocked on the backend.
2. **Search screen** — origin/destination pickers (dropdown or autocomplete from `/api/stops`), optional accessibility toggle, "Search" button.
3. **Results screen** — render each `JourneyOption` as a comparison card (fastest / cheapest / least-walking) showing total time, cost, walking distance, and a mini step list of segments (icon per mode). Tapping a card books it (`POST /api/tickets/book`) and navigates to Journey Detail.
4. **Journey Detail / Ticket screen** — show the single unified itinerary (walk → bus → metro → walk) as one connected timeline, the ticket ID, and the updated wallet balance.
5. **Map view** — plot the stops of the selected itinerary and draw the path (Leaflet polyline), colored by mode, using the `Line.color` field.
6. **Live Journey screen** — polls `GET /api/tickets/:ticketId/live` every 5s. Include a visible **"Simulate Delay" demo button** (calls `POST /api/simulate/delay` on a segment in the current itinerary) so judges can trigger the "wow" moment live. When `rerouted` comes back, show a clear before/after banner ("Bus delayed 15 min → new route via Metro Blue, arriving 7 min later").
7. **Wallet/Profile screen** — balance + transaction history from `/api/wallet/:userId`.
8. **Crowd + eco UI (stretch)** — small colored dot/badge per line on results and detail screens; a "CO₂ saved" chip on the ticket screen.
9. **Accessibility toggle (stretch)** — a switch on the search screen passing `prefs.accessible` through to search.
10. **Gamification + mini analytics (stretch, only if time remains)** — a simple profile badge ("14 trips · 9.2 kg CO₂ saved") computed client-side from wallet/ticket history; a static "City Insights" page with 2–3 mocked charts to gesture at the bigger vision during the pitch.
11. **Polish pass** — consistent spacing/typography, loading and empty/error states for every screen, mobile-responsive layout.

## B4. Deliverables checklist

- [ ] Every screen works fully against `mockApi.js` even if the backend isn't ready
- [ ] Switching `mockApi.js` → real API requires changing one config value, not rewriting components
- [ ] "Simulate Delay" button produces a visible, understandable reroute banner within 5–10s
- [ ] No dead-end screens (every state — loading, empty, error — is handled)

## B5. Sync protocol — what to tell your teammate, and when

- **Hour 2:** confirm the contract (A5) is final before either of you writes real logic against it.
- **Any time you notice the contract doesn't quite fit a UI need** (e.g., you need an extra field): don't silently invent it in your mock and move on — flag it to your teammate, update A5 in *both* documents together, then proceed.
- **Before Checkpoint A:** confirm you're ready to flip from `mockApi.js` to the real API the moment Engineer 1 says search/booking are live.
- **Before Checkpoint B:** ask Engineer 1 exactly which segment (line + stop pair) their seed data supports for a clean, reliable delay simulation, and wire your "Simulate Delay" button to that specific segment — don't guess.
- **Anytime you're displaying something as if it's live/real but it's actually mocked client-side** (e.g., the gamification badge, city insights charts): say so, so the pitch doesn't overstate what's real.
