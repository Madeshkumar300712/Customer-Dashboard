# 🚀 Customer Dashboard 

### A world-class full-stack Custom Dashboard Builder — MERN Stack · Real-time · PWA-ready

*Customer Dashboard · 2026 | Built by **Madesh Kumar (Maddy)***

[🌐 Live Demo](#) · [📸 Screenshots](#-screenshots) · [⚡ Quick Start](#-quick-start) · [📖 Docs](#-project-structure)

---

</div>

## 📌 What is this?

The **Customer Dashboard** is a full-stack analytics platform that lets users create fully personalised dashboards by dragging and dropping interactive widgets onto a canvas. Every widget — charts, KPI cards, tables, funnels, heatmaps — connects live to a real customer order database, giving users instant visual insights into their business data.

Built as part of **Halleyx Full Stack Engineer Challenge II · 2026**, this project demonstrates production-grade architecture, real-time features, and a polished UI that works across all devices.

---

## ✨ Features

### 🧩 Dashboard Builder
- **Drag-and-drop canvas** — drag widgets from the panel onto a 12-column grid
- **10+ widget types** — Bar, Line, Area, Scatter, Pie, Funnel, Heatmap, Gauge, KPI, Table, AI Insights
- **Widget settings panel** — configure titles, data sources, colours, aggregation, and size
- **Widget lock / duplicate / delete** with hover action buttons
- **Undo / Redo** (Cmd+Z / Cmd+Y) for all canvas changes
- **6 starter templates** — Sales Overview, Revenue Report, Operations, Executive Summary, Product Performance, Customer Analytics
- **Multiple dashboards** — create, rename, duplicate, and delete dashboards
- **Save & restore** — all layouts persist to MongoDB

### 📊 Widgets & Analytics
- **KPI cards** with sparkline trend charts and % change vs previous period
- **Bar, Line, Area, Scatter charts** with custom colour picker and data labels
- **Pie chart** with legend toggle
- **Funnel chart** for order pipeline conversion
- **Heatmap** showing activity by day and hour
- **Gauge / Donut meter** for target tracking
- **AI Insights widget** — live typed summary of your order data
- **Date filter** — All time · Today · Last 7/30/90 days

### 📦 Customer Order Management
- **Full CRUD** — create, edit, duplicate, delete orders
- **Order detail side panel** with Details · Timeline · Notes tabs
- **Timeline tracking** — every field change is logged with who changed it
- **Internal notes** per order with author and timestamp
- **Quick inline status update** — click the status badge to change it instantly
- **Column visibility toggle** — show/hide any table column
- **Advanced filters** — status, product, min/max amount
- **Bulk operations** — select multiple orders → bulk status update or bulk delete
- **CSV export** — download all orders as a spreadsheet
- **CSV import** — upload orders from a file with preview and validation
- **PDF invoice generation** — professional A4 invoice with tax calculation
- **Sort by** any column (ascending / descending)

### 🔐 Authentication & Security
- **JWT-based login and registration**
- **bcrypt password hashing** — passwords never stored as plain text
- **Role-based access** — Admin · Editor · Viewer
- **Protected routes** — unauthenticated users redirected to login
- **Auto-logout** on token expiry

### 🔔 Real-time & Notifications
- **WebSocket notifications** via Socket.io — live alerts when orders are created, updated, or deleted
- **Notification centre** in the navbar with unread badge and mark-all-read
- **Toast notifications** for all user actions (success and error)

### 🎨 UI/UX
- **Dark mode and Light mode** with smooth CSS variable transition
- **Collapsible sidebar** — full width ↔ icon-only mode
- **Command palette** (Cmd+K) — fuzzy search navigation across dashboards and pages
- **Keyboard shortcuts panel** (`?` key)
- **Onboarding tour** for first-time users
- **Responsive design** — 12-column desktop · 8-column tablet · 4-column mobile stack
- **PWA support** — installable on any device, works offline for static assets

### 📈 Additional Pages
- **Analytics** — revenue by product, order status donut, trend line, creator leaderboard
- **Reports** — CSV export, PDF invoice, summary statistics
- **Team** — per-member order count, revenue, completion rate with progress bars
- **Settings** — dark/light toggle, notification preferences, profile, sign out

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Database | MongoDB + Mongoose | Document storage, schema validation, embedded sub-documents |
| Backend | Node.js + Express.js | REST API server, routing, middleware |
| Auth | JWT + bcryptjs | Stateless authentication, secure password hashing |
| Real-time | Socket.io | WebSocket-based live order notifications |
| Frontend | React 18 + Vite | Component UI, fast HMR development build |
| State | Redux Toolkit | Global state — orders, dashboards, auth, theme, notifications |
| Routing | React Router v6 | SPA page navigation, protected routes |
| Charts | Recharts | Responsive chart components connected to live data |
| PDF | jsPDF + autotable | Client-side invoice PDF generation |
| Styling | CSS Variables | Theme-aware dark/light mode design system |

---

## 📁 Project Structure
```
halleyx-dashboard/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, register, me
│   │   ├── orderController.js     # Full order CRUD + bulk + import/export
│   │   ├── dashboardController.js # Dashboard CRUD + templates + duplicate
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── auth.js                # JWT protect + role authorize
│   ├── models/
│   │   ├── Order.js               # Order schema with notes[] + timeline[]
│   │   ├── User.js                # User schema with bcrypt hook
│   │   ├── Dashboard.js           # Dashboard with widgets[] Mixed type
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── notificationRoutes.js
│   ├── .env.example
│   ├── server.js                  # Express + Socket.io entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   └── sw.js                  # Service worker (offline cache)
│   └── src/
│       ├── api/
│       │   └── index.js           # Axios instance + all API calls
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── DashboardCanvas.jsx     # Drag-drop grid canvas
│       │   │   ├── WidgetPanel.jsx         # Draggable widget list
│       │   │   ├── WidgetRenderer.jsx      # Routes to correct widget
│       │   │   ├── WidgetSettingsPanel.jsx # Per-widget config form
│       │   │   └── UndoRedoManager.js      # Undo/redo stack
│       │   ├── widgets/
│       │   │   ├── KPIWidget.jsx           # KPI + sparkline + trend
│       │   │   ├── ChartWidget.jsx         # Bar/Line/Area/Scatter
│       │   │   ├── PieWidget.jsx
│       │   │   ├── TableWidget.jsx
│       │   │   ├── GaugeWidget.jsx
│       │   │   ├── FunnelWidget.jsx
│       │   │   ├── HeatmapWidget.jsx
│       │   │   ├── AISummaryWidget.jsx
│       │   │   └── Sparkline.jsx
│       │   ├── orders/
│       │   │   ├── OrderTable.jsx          # Full orders table
│       │   │   ├── OrderForm.jsx           # Create/edit form
│       │   │   ├── OrderDetailPanel.jsx    # Side panel with tabs
│       │   │   └── CSVImport.jsx           # Import with preview
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx             # Collapsible nav + live stats
│       │   │   ├── Navbar.jsx              # Notifications + user menu
│       │   │   └── MobileNav.jsx           # Bottom sheet mobile nav
│       │   └── ui/
│       │       ├── Toast.jsx               # Toast notification system
│       │       ├── Modal.jsx
│       │       ├── ConfirmDialog.jsx
│       │       ├── ColorPicker.jsx
│       │       ├── CommandPalette.jsx      # Cmd+K search
│       │       ├── KeyboardShortcuts.jsx
│       │       ├── OnboardingTour.jsx
│       │       └── PWAInstallBanner.jsx
│       ├── hooks/
│       │   └── useSocket.js               # Socket.io connection hook
│       ├── pages/
│       │   ├── AuthPage.jsx
│       │   ├── DashboardsListPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── DashboardConfigPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── AnalyticsPage.jsx
│       │   ├── ReportsPage.jsx
│       │   ├── TeamPage.jsx
│       │   └── SettingsPage.jsx
│       ├── store/
│       │   ├── index.js
│       │   ├── authSlice.js
│       │   ├── orderSlice.js
│       │   ├── dashboardSlice.js
│       │   ├── notificationSlice.js
│       │   └── themeSlice.js
│       ├── utils/
│       │   ├── dataAggregator.js          # Chart data transforms
│       │   └── exportUtils.js             # CSV download + PDF invoice
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css                      # Full design system
│
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local installation or [MongoDB Atlas](https://cloud.mongodb.com) free tier)

### 1. Clone the repository
```bash
git clone https://github.com/Madeshkumar300712/Customer-Dashboard.git
cd Customer-Dashboard
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
MONGO_URI=mongodb://localhost:27017/halleyx_dashboard
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the backend:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Create your first account

Click **Register** on the login page and create an account. Then:
1. Go to **Customer Orders** → create a few orders
2. Go to **Dashboard** → click **New Dashboard**
3. Click a **Starter Template** or drag widgets onto the canvas
4. Click **Save Configuration** — your dashboard is live!

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/halleyx` |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret key for signing JWTs | Any long random string |

---

## 📸 Screenshots

> Dashboard List Page

![Dashboard List](screenshots/dashboard-list.png)

> Dashboard Config — Drag & Drop Canvas

![Dashboard Config](screenshots/dashboard-config.png)

> Customer Orders Table

![Orders](screenshots/orders.png)

> Analytics Page

![Analytics](screenshots/analytics.png)

---

## 🗺️ API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| POST | `/api/orders/:id/duplicate` | Duplicate order |
| POST | `/api/orders/:id/notes` | Add internal note |
| GET | `/api/orders/export/csv` | Download CSV |
| POST | `/api/orders/import` | Import from CSV |
| POST | `/api/orders/bulk/update` | Bulk status change |
| POST | `/api/orders/bulk/delete` | Bulk delete |

### Dashboards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | List user dashboards |
| POST | `/api/dashboard` | Create dashboard |
| GET | `/api/dashboard/templates` | Get 6 starter templates |
| PUT | `/api/dashboard/:id` | Save layout |
| DELETE | `/api/dashboard/:id` | Delete dashboard |
| POST | `/api/dashboard/:id/duplicate` | Duplicate dashboard |
| PATCH | `/api/dashboard/:id/rename` | Rename dashboard |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+K` | Open command palette |
| `?` | Show keyboard shortcuts panel |
| `Cmd+Z` | Undo widget change (config page) |
| `Cmd+Y` | Redo widget change (config page) |
| `Cmd+S` | Save dashboard configuration |
| `Esc` | Close any open panel or modal |

---

## 🚀 Deployment

### Backend — Render / Railway

1. Push code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables: `MONGO_URI`, `PORT`, `JWT_SECRET`

### Frontend — Vercel / Netlify

1. Create a new project on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

> Update `frontend/src/api/index.js` baseURL to use `import.meta.env.VITE_API_URL` for production.

---

## 🔮 Future Enhancements

- [ ] Widget drag-to-reposition on canvas
- [ ] Widget resize handles (drag corners)
- [ ] Dashboard sharing via read-only link
- [ ] Excel (.xlsx) export
- [ ] Email alerts for order status changes
- [ ] Redis caching for heavy aggregation queries
- [ ] Natural language query — "show orders above $500"
- [ ] AI anomaly detection on revenue spikes

---

## 👨‍💻 Author

<div align="center">

**Madesh Kumar (Maddy)**
B.E Computer Science & Engineering

[![GitHub](https://img.shields.io/badge/GitHub-@madeshkumar-181717?style=flat-square&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Madesh_Kumar-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/your-profile)

</div>

---

## 📄 License

This project was built for the **Halleyx Full Stack Engineer Challenge II · 2026**.
It is intended for educational and demonstration purposes.

---

Made with ❤️ by **Madesh Kumar** · Customer Dashboard 2026

⭐ Star this repo if you found it useful!
