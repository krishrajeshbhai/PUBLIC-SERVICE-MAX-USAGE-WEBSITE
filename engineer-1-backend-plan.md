# TransitOne — Implementation Plan (1 of 2: BACKEND)
### For Engineer 1 — Backend, Journey Engine & Real-Time Logic

> **This is a paired document.** Its twin is `engineer-2-frontend-plan.md`, held by the other engineer. **Part A below is identical, word-for-word, in both documents.** If anything in Part A needs to change during the hackathon, update it in *both* files and tell your teammate immediately — Part A is the contract that keeps your two halves compatible. Part B is yours alone.

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

**Parallel-work rule:** the frontend engineer does not wait for these to be live. They build a `mockApi.js` returning hardcoded objects in these exact shapes, build the whole UI against it, then swap the base URL once your real endpoints are ready. Your job is to make sure the real responses match this table exactly, field for field.

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

# PART B — YOUR PLAN: BACKEND (Engineer 1)

## B1. What you own

The Node.js/Express API, the journey-planning algorithm, all persistence, and the real-time delay/reroute logic. Every response you send must match the shapes in **A4/A5 exactly** — the frontend is coding against those shapes starting Hour 2, before your real endpoints exist.

## B2. Recommended stack

Node.js + Express, `lowdb` (JSON-file persistence) or `better-sqlite3`, plain JS graph algorithm (no routing library needed for a graph this small).

## B3. Task list, in order

1. **Project setup** — `npm init`, Express, CORS enabled, nodemon for dev.
2. **Seed data** — create `data/stops.json`, `data/lines.json`, `data/walkEdges.json`. ~15–20 stops, 2 metro lines + 2 bus lines, a handful of walking edges connecting nearby stops. Use names that read well in a demo.
3. **Graph builder** — on server start, build an in-memory graph: nodes = stops, edges = {bus/metro segments between consecutive stops on a line} + {walk edges}. Each edge carries `minutes`, `cost`, `mode`.
4. **Journey search algorithm** — implement Dijkstra (or simple BFS/DFS with pruning given the small graph) three times with different edge weights:
   - *fastest*: weight = minutes
   - *cheapest*: weight = cost
   - *least_walking*: weight = walking minutes only (heavily penalize walk edges beyond a threshold)
   - *accessible* (stretch): exclude any line/stop flagged `noStairs: false`
   Return the top result per weighting as a `JourneyOption`; dedupe if identical.
5. **`POST /api/journeys/search`** — validate stop IDs exist, run the algorithm, return `{ options }`.
6. **Wallet + Ticket service** — seed each demo user with a starting balance (e.g., ₹500). `POST /api/tickets/book` creates a `Ticket`, deducts `totalCost` from wallet, records a `WalletTxn`, persists to disk.
7. **`GET /api/wallet/:userId`** — return balance + transaction list.
8. **Delay simulation** — `POST /api/simulate/delay` stores a `DelayEvent` keyed by segment. For any *active* ticket whose itinerary includes that segment and hasn't passed it yet: mark it `rerouted`, re-run the search algorithm from the current point with the delay penalty added to that edge, attach the new `JourneyOption` as `rerouted` on the ticket.
9. **`GET /api/tickets/:ticketId/live`** — return current status; if `rerouted`, include the alert message and the new option. Simple polling is fine — don't build WebSockets unless Checkpoint B lands early and you have spare time.
10. **Crowd + eco endpoints** — crowd level can be a small pseudo-random/time-of-day function per line (deterministic enough to look real in a demo). CO₂ saved: simple constant-per-km formula vs. driving (e.g., `distanceKm * 120g` avoided).
11. **Hardening** — handle "no route found," invalid stop IDs, double-booking, server restart (persistence must survive it).

## B4. Deliverables checklist

- [ ] All 7 contract endpoints implemented, returning the exact shapes in A5
- [ ] Seed data varied enough that fastest ≠ cheapest ≠ least-walking for at least one origin/destination pair
- [ ] Delay simulation visibly changes an active ticket's route
- [ ] Data persists across a server restart

## B5. Sync protocol — what to tell your teammate, and when

- **Hour 2:** confirm the contract (A5) is final before either of you writes real logic against it.
- **Any time you must change a field name or response shape:** stop, message your teammate, update A5 in *both* documents, then proceed. Never let the two documents' Part A drift apart.
- **Before Checkpoint A:** tell them your real `/api/journeys/search` and `/api/tickets/book` are live and matching contract, so they can flip off `mockApi.js`.
- **Before Checkpoint B:** tell them exactly which segment (line + stop pair) your seed data supports for a clean, reliable delay-simulation demo, so they wire the "Simulate Delay" button to that specific segment.
- **Anytime something is mocked/hardcoded rather than fully real** (e.g., crowd levels are pseudo-random, not live): say so, so it isn't presented to judges as more "live" than it is.
