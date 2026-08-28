# 🚆 TransitOne — Unified Multi-Modal Mobility Ecosystem

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/transitone)

**TransitOne** turns *"how do I get from A to B"* into one search, one unified ticket, and one wallet — across bus, metro, and walking — and automatically re-plans your trip the moment a delay occurs.

Built as three distinct user products inside one unified platform:
1. 🚍 **Passenger App** (`/passenger`): High-utility mobile-first commuter product with 1-click usual route booking, live connected itinerary timeline, digital QR ticket, wallet balance auto-debit, and instant delay reroute simulation.
2. 🌍 **Visitor Experience** (`/visitor`): Reassuring international travel companion supporting 9 languages (EN, HI, TA, TE, FR, DE, ES, JA, KO), 5-step onboarding wizard, tourist destination guides with audio explanations, step-by-step navigation, driver translation cards, and 24/7 SOS safety center.
3. 👔 **Employee Portal** (`/employee`): Dedicated operations & fleet management platform for transit staff.

---

## ⚡ 1-Tap Vercel Deployment

Deploying directly to Vercel takes **0 configuration**:

1. Push this repository to GitHub.
2. Click **"Import"** on [Vercel](https://vercel.com).
3. Select your GitHub repository.
4. Click **"Deploy"** — `vercel.json` automatically configures the Vite build, output directory (`frontend/dist`), and SPA routing rewrites.

---

## 🚀 Quick Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/transitone.git
cd transitone
npm run install:all
```

### 2. Run Frontend Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates production-ready bundle in `frontend/dist/`.

---

## 🏗️ Architecture & Project Structure

```text
transitone/
├── vercel.json                 # Root Vercel zero-config deployment descriptor
├── package.json                # Monorepo scripts
├── .gitignore                  # Clean repository ignores
│
├── frontend/                   # Vite + React 18 SPA
│   ├── vercel.json             # Subfolder Vercel routing fallback
│   ├── vite.config.js          # Vite build & proxy config
│   ├── src/
│   │   ├── modules/
│   │   │   ├── passenger/      # MODULE 1: Commuter App (Shell, Auth, Home, Search, Tickets, Trips, Wallet, Profile)
│   │   │   └── visitor/        # MODULE 2: Tourist Experience (Shell, Auth, Onboarding, Explore, Guided Nav, Help)
│   │   ├── pages/              # Main Landing Product Selector & Employee Portal
│   │   ├── components/         # Leaflet MapComponent, Dynamic QR, Navbar
│   │   ├── i18n/               # 9-Language internationalization engine
│   │   └── services/           # Dual API client (Live Backend + In-Memory Mock Fallback)
│
└── backend/                    # NestJS / Express Backend API
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Leaflet & React-Leaflet, Lucide Icons, Web Speech Synthesis API.
- **Styling**: CSS Tokens, Dark Mode Glassmorphism, Responsive Mobile Bottom Bar & Desktop Sidebar.
- **Deployment**: Vercel (Edge CDN, Automated Continuous Deployment, Clean SPA Rewrites).