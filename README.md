# Acme Dynamics — Enterprise Operations Management System
[![Code Quality Check](https://github.com/YhoanQuispe/acme-dynamics-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/YhoanQuispe/acme-dynamics-dashboard/actions)

An exquisite, high-performance, single-screen B2B Enterprise Resource Planning (ERP) dashboard tailored for high-density operations management and system-wide telemetry synchronization. Built with **React 19**, **Vite**, **TypeScript**, and styled with custom **Tailwind CSS** transitions under **motion** kinetic animations.

---

## 🎨 Visual Philosophy & Interactive Design

Acme Dynamics is designed for professional operators who require rapid visual ingestion, dense telemetry displays, and fluid interactive feedback.

*   **Adaptive Dual Theme (System Sync)**: Custom eye-safe dark palettes and light themes styled around modern slate and zinc tones. Rich dark mode features responsive border strokes and deep-shadow layers designed for multi-monitor workstation setups.
*   **Collapsible Navigation Console**: Interactive, sliding navigation sidebar with elegant spring transitions driven by `motion/react`. Saves horizontal real estate while supporting responsive touch-targets on mid-sized mobile tablets.
*   **Secure Access Gatekeeper**: Fully customized entry screen leveraging a clean password/token container block, professional brand headers, and an ambient top-gradient security stripe.
*   **Kinetic Hover Feedback & Ripple Animations**: Direct visual cues on table rows, metric cards, status selector overlays, and filter keys to promote high operational precision.

---

## 📊 Core Functional Modules

The application is structured into modular dashboards, keeping data layouts elegant, accessible, and mathematically validated for enterprise requirements:

1.  **Dynamic Command Center (Main Dashboard)**
    *   **Financial Diagnostics**: Real-time weekly revenue modeling sitting at a balanced **$95,384.62** mapped logically to a global **$1,240,000.00** quarterly benchmark.
    *   **Queue Status Metrics**: Active order volume trackers and real-time fulfillment speedometers.
    *   **Regional Capacities**: Live telemetry on regional warehouse utilization rates (US East, US West, and EU Central).
2.  **Telemetry & Analytics Engine (Analytics Platform)**
    *   **Perfect Order Rate**: Calibrated to a realistic, high-tier **96.82%** enterprise standard (completely overriding flawed or low-tier percentages).
    *   **Time-Series Visualization**: High-contrast trend metrics tracking monthly dispatch times and operational growth vectors.
    *   **Multiplier Controls**: Simulate performance variation across varied supply chain conditions.
3.  **Fulfillment Registry (Orders Registry)**
    *   **Pipeline Balance**: Active booking volumes tracking currently queued orders, calibrated to sit cleanly around **$120,000.00**.
    *   **Dynamic Logs**: Full tabular registry sample spanning transactional tracking (ORD-2026-001 through ORD-010) with reactive status update buttons.
    *   **Fulfillment Alignment**: Seamlessly synchronized with a baseline **96.2%** overall shipping rate.
4.  **Portfolio Account Directory (Customers Directory)**
    *   **Client Ledger**: Track the 6 core enterprise accounts holding a high-retention contract rate of **98.7%**.
    *   **Total Managed Value**: Total account contract metrics mathematically aligned with a **$1,450,000.00** baseline.
5.  **High-Velocity Stock Ledger (Inventory Catalog)**
    *   **Hardware Specifications**: Monospaced item profiles representing enterprise assets (e.g., Rack-mounted 1U Industrial Servers, 48-port Managed Switches, and Titanium Power Units).
    *   **Auto-Trigger Safety Thresholds**: Smart limits flagging low-level restock alerts dynamically to retain order velocity.

---

## 🛠️ Stack & Engineering Craftsmanship

*   **Frontend Library**: React 19.x (Functional Components + Performance Hooks)
*   **Build Bundler**: Vite 6.x (Fast Multi-Module compiles)
*   **Typing System**: TypeScript (Strong compiler boundaries)
*   **Styling Engine**: Tailwind CSS (Optimized CSS builds)
*   **Choreography**: motion/react (Smooth micro-transitions)
*   **Safe Sandbox Storage**: Custom memory-fallback `safeStorage` driver for fully-isolated sandboxed environments
*   **Icon Elements**: Lucide React (Clean, vector-accurate visual cues)

---

## 🚀 Setting Up the Project

Follow these steps to initialize and run the workstation shell locally:

### 1. Prerequisites
Ensure you have the latest LTS release of **Node.js** (v18+ recommended) and **npm** installed on your operational system.

### 2. Installations
Clone the workspace files into your directory and run the standard package manager setup:
```bash
npm install
```

### 3. Spin Up Development Server (HMR Mode)
Run the fast development builder. This binds the port directly to local ingress:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your local browser.

### 4. Code Quality & Lints
Validate TypeScript configurations and structural syntax alignments without bundling:
```bash
npm run lint
```

### 5. Production Output Compilation
Bundle code into lightweight, fully distribution-ready static files inside the `dist/` folder:
```bash
npm run build
```

---

## 💼 Portfolio Highlights (For Independent Clients & Freelance Review)

This project demonstrates the execution of **highly rigorous enterprise standards** on the frontend:
*   **Mathematical Coherence**: Data is not simply randomized placeholder values. All components feed from a logically synchronized dataset modeled after actual corporate workflows (e.g., quarterly revenue mapping seamlessly into localized weekly values, contract totals matching client directory weights).
*   **Modular Architecture**: Fully divided components (`AnalyticsView`, `CustomersView`, `DashboardView`, `InventoryView`, `OrdersView`, `SettingsView`) ensure clean vertical scaling and prevent infinite component re-renders.
*   **Robust Sandbox & Iframe Resiliency**: Replaced standard direct `localStorage` access across all modules with a thread-safe, memory-backed storage provider (`safeStorage`) and hardened layout query engines (such as wrapping standard `matchMedia` queries). This ensures zero runtime script exceptions or SecurityError crashes when rendered within strict iframe containers or browser sandbox contexts.
*   **Sleek Typography & Aesthetics**: Optimized spacing, customized text tracking (`tracking-tight`), and human-centric labels override classic generic layouts to deliver modern product designs suitable for premium SaaS products.
