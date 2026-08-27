# Digital Pylot — Car Rental Admin Dashboard

A fully functional, responsive, and dynamic **Car Rental Admin Dashboard** built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

Designed with high visual fidelity based on administrative dashboard benchmarks while offering a complete data layer, interactive filtering, real-time search, responsive mobile drawer, and modular component architecture.

---

## 🌟 Key Features

- **🎯 Visual Accuracy & Proportions**: Follows strict administrative dashboard layout standards with left sidebar, sticky header, stat cards, data tables, and analytics charts.
- **📊 Real-time Statistics & Analytics**:
  - **Weekly Earnings Card**: Dynamic revenue metrics and growth indicators.
  - **Total Bookings & Active Fleet Utilization**: Interactive progress bars and live count badges.
  - **Revenue Analytics Chart**: Powered by Recharts with support for **Weekly**, **Monthly**, and **Yearly** period switching.
  - **Bookings by Location**: City-based performance breakdown with featured primary rental hubs.
- **🚗 Most Rented Vehicles**: Top-performing fleet cards with booking metrics, daily rates, ratings, and a full-view modal catalog.
- **💳 Recent Transactions Table**:
  - Booking codes, vehicle thumbnails, payment method breakdown (PayPal, Apple Pay, Stripe, PayU), and status indicators (**Success**, **Pending**, **Cancelled**).
  - Live tab filtering by transaction status.
  - Interactive "View All" transactions modal.
- **🔎 Dynamic Header Search**: Live filtering across vehicles, customer names, booking IDs, and payment methods with empty state feedback.
- **📅 Functional Date Range Filter**: Supports period selection (*This Week, Last 7 Days, This Month, Last 30 Days, Year to Date, Custom Range*) with dynamic data recalculation.
- **➕ Quick Add Booking Modal**: Triggered from header to dynamically inject new booking reservations into the transactions feed.
- **📱 Fully Responsive**: Custom mobile sidebar drawer with backdrop blur overlay, keyboard (`Escape`) listeners, and adaptive grid columns for mobile/tablet/desktop.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Charts**: [Recharts v2](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
Digital pylot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/       # Aggregated API route (/api/dashboard)
│   │   │   ├── locations/       # Location analytics endpoint (/api/locations)
│   │   │   ├── revenue/         # Revenue analytics endpoint (/api/revenue)
│   │   │   ├── transactions/    # Recent transactions endpoint (/api/transactions)
│   │   │   └── vehicles/        # Fleet vehicles endpoint (/api/vehicles)
│   │   ├── globals.css          # Tailwind & custom scrollbar styles
│   │   ├── layout.tsx           # App root layout
│   │   └── page.tsx             # Main Admin Dashboard page container
│   ├── components/
│   │   └── dashboard/           # Modular dashboard components
│   ├── data/
│   │   └── mockData.ts          # Central data layer & state calculation logic
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── dashboard.ts         # TypeScript interfaces & domain types
```


---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have **Node.js** (v18.18 or higher) and **npm** installed on your system.

Check node version:
```bash
node -v
```

### 1. Navigate to Project Directory

```bash
cd "C:\Users\THI9S PC\Desktop\Digital pylot"
```

### 2. Install Dependencies

Install all required NPM packages:
```bash
npm install
```

### 3. Run Development Server

Start the Next.js local development server:
```bash
npm run dev
```

Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

## 📜 NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts local development server on port 3000 |
| `npm run build` | `next build` | Compiles application for production |
| `npm run start` | `next start` | Starts production server |
| `npm run type-check`| `tsc --noEmit` | Performs TypeScript static type checking |
| `npm run lint` | `next lint` | Runs ESLint code quality checks |

---

## 🔌 API Documentation

The dashboard consumes data through a structured backend layer. API routes are available at:

- `GET /api/dashboard?dateRange=this_week&search=&status=All&revenuePeriod=monthly&location=All+Locations`  
  *Returns aggregated dashboard payload including user profile, stats, vehicles, transactions, chart data, and location metrics.*
- `GET /api/vehicles`  
  *Returns all fleet vehicles list.*
- `GET /api/transactions`  
  *Returns transaction history list.*
- `GET /api/revenue?period=monthly`  
  *Returns revenue chart data points (`weekly` \| `monthly` \| `yearly`).*
- `GET /api/locations`  
  *Returns city booking distribution metrics.*

---

## 💡 Customization & Extension

- **Connecting to a Real Database**:  
  Replace the data fetching logic inside `src/data/mockData.ts` or directly inside the `/api/*` route handlers with database queries (Prisma, PostgreSQL, MongoDB, Supabase, etc.).
- **Theme & Branding**:  
  Colors and typography can be customized in `tailwind.config.ts`.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
