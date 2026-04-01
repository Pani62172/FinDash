# FinDash — Personal Finance Dashboard

A modern, interactive finance dashboard to track income, expenses, and spending patterns. Built with React, Vite, and vanilla CSS.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

The dev server URL will be printed in the terminal (default: `http://localhost:5173`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (JavaScript) |
| Build | Vite |
| Routing | React Router v6 |
| State | React Context + useReducer |
| Charts | Recharts |
| Styling | Vanilla CSS + Custom Properties |
| Fonts | Poppins (headings) + Inter (body) |

---

## Features

### Dashboard
- Summary cards with animated count-up (Balance, Income, Expenses, Savings Rate)
- Monthly balance trend (area chart)
- Spending breakdown by category (donut chart)
- Recent transactions at a glance

### Transactions
- Full transaction table with search, category and type filters, column sorting
- Add, edit, and delete transactions (Admin role only)
- Export filtered data as CSV or JSON

### Insights
- Highest spending category, average daily and monthly spend
- Month-over-month spending change indicator
- Income vs Expenses comparison (bar chart)
- Expense trend over time (line chart)
- Category breakdown with progress bars
- Top 5 largest expenses with contextual observations

### Role-Based UI
- **Admin** — Full access to add, edit, and delete transactions
- **Viewer** — Read-only; all mutation controls are hidden
- Switch roles via the sidebar toggle

### Dark Mode
Full light/dark theme toggle using CSS custom properties. Persists across sessions.

### Data Persistence
Transactions, active theme, and selected role are saved to `localStorage` and restored on reload.

### Responsive Design
Adapts to mobile, tablet, and desktop. Sidebar collapses to a hamburger menu on small screens.

---

## Project Structure

```
src/
├── components/
│   ├── Cards/             # SummaryCard with count-up animation
│   ├── EmptyState/        # Placeholder for empty/filtered views
│   ├── Layout/            # Sidebar, Header, Layout shell
│   ├── Modal/             # Reusable modal overlay
│   └── TransactionForm/   # Add/Edit form with validation
├── context/
│   └── AppContext.jsx     # Global state (useReducer + localStorage)
├── data/
│   └── mockData.js        # Sample transactions + helper functions
├── pages/
│   ├── Dashboard/         # Overview with cards and charts
│   ├── Transactions/      # Table with CRUD, filters, export
│   └── Insights/          # Analytics, charts, observations
├── App.jsx                # Routing
├── main.jsx               # Entry point
└── index.css              # Design system (CSS variables, reset, utilities)
```

---

## Approach

- **Design system first** — All colors, spacing, shadows, typography, and theme variants are defined as CSS custom properties in `index.css`. Dark mode swaps variables via `[data-theme="dark"]` with zero layout recalculation.
- **Single source of truth** — A single `useReducer` inside React Context manages transactions, filters, role, and theme. Derived data (filtered/sorted results) is computed in the provider and passed down.
- **Co-located styles** — Each component has its own CSS file alongside it, keeping styles scoped and maintainable.
- **Mock data layer** — 50 realistic transactions with helper functions (`getMonthlyData`, `getSpendingByCategory`) that compute chart-ready data from raw transactions. Swap the data source to an API without touching the UI.

---

## License

MIT
