# ⚡ Dev on — Workspace Manager

> **Next-Generation Project & Sprint Orchestration Platform**  
> *Combining the spatial clarity of Notion with the agile velocity of Jira.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12.0-purple?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.2.0-ff69b4?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 📌 Executive Overview

**Dev on Workspace Manager** is a high-performance, minimalist workspace engineered for ambitious software teams. It bridges the gap between flexible document-style interfaces and strict sprint pipeline management. 

Featuring **instant multi-view switching** (Tri-Tone Kanban, Dense Table, and Sprint Calendar), **deep subtask lifecycles with real-time progress calculations**, **Role-Based Access Control (RBAC)** across multi-user personas, a **global Command Palette (`⌘K`)**, **Undo/Redo history stack**, and **enterprise-grade data portability** (3-Column Printable PDF reports & full-state JSON backup/restoration).

---

## 👥 Pre-Configured Personas & Team Directory

The login module and workspace come with 4 pre-seeded personas representing standard software team roles:

| Avatar | Persona Name | Role | Email | Designation | Permissions Scope |
| :---: | :--- | :--- | :--- | :--- | :--- |
| <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" width="32" height="32" style="border-radius:50%" /> | **Alex Morgan** | `👑 Owner` | `alex@devon.io` | Founder & Tech Lead | Full administrative rights: Workspace deletion, user roles, project creation, and task management. |
| <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50" width="32" height="32" style="border-radius:50%" /> | **Sarah Chen** | `🛡️ Admin` | `sarah@devon.io` | Lead Product Manager | Operational control: Workspace settings, project templates, sprint management, and team assignment. |
| <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" width="32" height="32" style="border-radius:50%" /> | **Mike Ross** | `💻 Member` | `mike@devon.io` | Senior Frontend Engineer | Engineering execution: Task edits, subtask checklist completions, comment threads, and file uploads. |
| <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" width="32" height="32" style="border-radius:50%" /> | **Emma Watson** | `👁️ Viewer` | `emma@devon.io` | External Client / Stakeholder | Audit & observation mode: Read-only access to boards, tables, calendars, and export reports. Modifying or deleting tasks is restricted. |

*You can 1-click login as any of these personas directly from the Login Modal or switch between them on-the-fly using the bottom Persona Switcher in the sidebar.*

---

## 🌟 Key Features & Capstone Domains

### 1. 🗂️ Multi-Workspace & Project Hierarchy
- **Nested Structure**: Separate company operations across multiple Workspaces (e.g., *Dev on Core HQ*, *Marketing Engine*, *Open Source Labs*) and nested Projects (*Sprint Launch*, *Mobile App v2*, *Design System*).
- **Template Engine**: 1-click workspace/project creation with pre-seeded sprint templates.
- **Project Archiving**: Archive and unarchive inactive projects without losing history.

### 2. 🔀 Multi-View Engine (One Source of Truth)
Switch effortlessly between three specialized views while retaining all active search queries, priority filters, and sort options:
- **📋 3-Tone Visual Kanban Board**:
  - **🟡 TO DO** (`#f59e0b` amber accent header)
  - **🟢 IN PROGRESS** (`#10b981` emerald accent header)
  - **🔴 COMPLETED** (`#f43f5e` rose accent header)
  - Column task counters, priority badges, assignee avatars, and drag-and-drop / 1-click status transitions.
- **📊 Dense Notion-Style Table View**:
  - Compact table view with sortable columns, inline status pills, priority indicators, assignee titles, and due dates.
- **📅 Sprint Calendar View**:
  - Month-at-a-glance schedule displaying tasks as interactive chips scheduled on their due dates.

### 3. 🎯 Deep Task Lifecycle Management
- **Checklist Subtasks**: Break tasks into granular checklist items with dynamic, auto-calculating real-time percentage progress bars.
- **Rich File Attachments**: Attach images, documents, and specifications with preview links, file sizes, and deletion controls.
- **Timestamped Activity Feed & Comments**: Collaborative discussion thread on every task with avatar badges and time indicators.
- **Priority Matrix**: Visual tags for `🔴 Urgent`, `🟡 High`, `🟢 Medium`, and `⚪ Low`.
- **Bulk Multi-Select Actions**: Select multiple tasks simultaneously to bulk-update their status or batch-delete.

### 4. ⚡ Productivity Power Tools
- **Command Palette (`⌘K` / `Ctrl+K`)**: Rapid spotlight modal to search tasks, toggle views, create tasks, switch themes, or export data without touching the mouse.
- **Undo / Redo Engine (`Ctrl+Z` / `Ctrl+Y`)**: Deep state history tracking for uninterrupted flow.
- **Keyboard Shortcuts Modal (`?`)**: Full hotkey cheatsheet accessible anywhere in the application.

### 5. 📄 Enterprise Data Portability & Reporting
- **Clean 3-Column Printable PDF Report**: Triggered via `Export PDF Report` or standard print (`Ctrl+P`). Formatted with `@media print` rules into a clean 3-column physical layout categorized by status.
- **JSON Full State Backup**: Download the entire workspace state (workspaces, projects, tasks, comments, and users) into a single timestamped JSON file.
- **JSON State Restoration**: 1-click upload to restore or transfer workspace states between browsers and machines.

### 6. 📡 Offline-First Architecture & Live Team Simulation
- **Persistent Storage**: All actions persist to `localStorage` automatically using synchronized Redux state subscriptions.
- **Offline Simulator**: Toggle between Online and Offline modes with one click to test disconnected behavior.
- **Simulated Real-Time Team Events**: Background simulation pushes realistic team updates (status transitions, comment mentions) every 45 seconds to test notification bells and activity streams.

### 7. 🎨 Premium Design System & Login Animation Module
- **Dribbble-Inspired Split-Screen Auth Modal**: Smooth sliding overlay panel with custom cubic bezier transitions (`[0.16, 1, 0.3, 1]`).
- **Interactive Ambient Backdrop**: Floating glowing aurora orbs and shimmering particle stars.
- **Full Team Directory on Login**: Complete persona profiles (avatars, names, roles, emails, titles, and 1-click instant login).
- **Form Validation Shake Animation**: Keyframe haptic-like shake on validation errors (`animate={{ x: [-10, 10, -7, 7, 0] }}`).
- **Dark & Light Mode**: Curated high-contrast HSL color palettes with smooth transitions.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Usman-CyberCode/workspace-manager-hackathon-project.git

# 2. Navigate into project directory
cd workspace-manager-hackathon-project

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Quick Login & Demo Walkthrough

The workspace manager supports multiple ways to access the application:

1. **1-Click Live Demo**: Click the **"Live Demo"** button in the header or hero section to enter directly as **Alex Morgan (Owner)**.
2. **Sign In**: Click **"Login"** or **"Sign In"** to open the animated auth console:
   - Browse all 4 team personas (Alex, Sarah, Mike, Emma) and click **"Enter ➔"** on any card for 1-click instant access.
   - Or enter work email `alex@devon.io` and password `••••••••`.
3. **Create Account**: Click **"Get Started"** to register a new user persona with custom role assignments.
4. **Log Out**:
   - Click the **Log Out** button at the bottom of the left Sidebar.
   - Click the **Sign Out** button in the top Navbar.
   - Or click **Sign Out** inside the User Profile settings modal.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette |
| <kbd>?</kbd> | Open Keyboard Shortcuts Modal |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Undo last task action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo undone task action |
| <kbd>Esc</kbd> | Close any open modal / overlay |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | Trigger Printable 3-Column PDF Sprint Report |

---

## 📂 Project Structure

```
workspace-manager/
├── app/
│   ├── globals.css            # Tailwind v4 theme, print rules, and animation tokens
│   ├── layout.tsx             # Root HTML layout & Next.js metadata
│   ├── page.tsx               # Main container (routes between LandingPage & Workspace)
│   └── users/                 # Dedicated user profile routes
├── components/
│   ├── AuthCard.tsx           # Deepak Yadav sliding split-screen login modal with animation & all users directory
│   ├── LoginScreen.tsx        # Alternative 4-digit OTP verification console
│   ├── LandingPage.tsx        # Responsive marketing landing page
│   ├── Navbar.tsx             # Top navigation bar, search, filters, views, and sign out
│   ├── Sidebar.tsx            # Left sidebar, workspace/project switcher, and persona controls
│   ├── KanbanBoard.tsx        # 3-tone color kanban pipeline with column controls
│   ├── TableView.tsx          # Notion-style dense data table view
│   ├── CalendarView.tsx       # Sprint calendar timeline view
│   ├── TaskDetailModal.tsx    # Full task lifecycle editor (subtasks, comments, attachments)
│   ├── NewTaskModal.tsx       # Rapid task creation modal
│   ├── ProjectModal.tsx       # Project creation with sprint templates
│   ├── WorkspaceModal.tsx     # Workspace creation with custom color themes & icons
│   ├── CommandPalette.tsx     # Spotlight search & rapid actions console (⌘K)
│   ├── ActivityLogModal.tsx   # Comprehensive workspace audit log
│   ├── KeyboardShortcutsModal.tsx # Hotkeys reference modal
│   ├── ToastContainer.tsx     # Animated feedback notifications
│   └── landing/               # Modular landing page sections (Hero, Features, Views, CTA, Footer)
├── lib/
│   └── mockdata.ts            # Seeded personas, initial workspaces, projects, and sprint tasks
├── store/
│   └── index.ts               # Central Redux Toolkit store, slices, and persistence logic
├── public/                    # Static assets and icons
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🛠️ Built With

- [Next.js 16 (App Router)](https://nextjs.org/) — Server-side rendering, routing, and font optimization.
- [React 19](https://react.dev/) — Modern component architecture with optimistic UI patterns.
- [Redux Toolkit](https://redux-toolkit.js.org/) — Predictable global state management, history tracking, and local storage reconciliation.
- [Framer Motion](https://www.framer.com/motion/) — Fluid spring physics, layout animations, floating ambient effects, and stagger entrances.
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling with dark/light mode and custom CSS tokens.
- [Lucide React](https://lucide.react.dev/) — Consistent, pixel-perfect icon system.

---

## 📄 License

This project was built for the Hackathon. Released under the [MIT License](LICENSE).
