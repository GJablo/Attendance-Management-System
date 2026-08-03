# Attendance Management System

A full-stack attendance and leave management system built with a Node.js/Express backend, MongoDB data storage, and a React (Vite) frontend.

## Project Status

- Backend API is implemented in `Server/`
- Data models for `User`, `Employee`, `Student`, `Attendance`, and `Leave` are defined with Mongoose
- Authentication, authorization, attendance tracking, leave requests, and reporting routes are available
- Arcjet middleware provides rate limiting and bot protection on incoming requests
- Attendance marking is blocked (server-side) for users on approved leave for the current day
- Seed data script added for local testing
- Frontend is implemented in `Client/` using React and Vite, split into an API layer, custom hooks, and presentational components
- UI is built with Tailwind CSS v4 and includes a responsive sidebar app shell and a light/dark theme toggle

## Technologies

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Arcjet (`@arcjet/node`) for rate limiting and bot protection
- dotenv
- cookie-parser
- morgan (request logging)
- nodemon (development)

### Frontend

- React 19
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- ESLint

## Repository Structure

```
ManagementSystem/
├── Client/                # frontend implementation (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── attendance.js
│   │   │   ├── leaves.js
│   │   │   └── reports.js
│   │   ├── hooks/
│   │   │   ├── useRoute.js
│   │   │   ├── useAuth.js
│   │   │   ├── useTheme.js
│   │   │   ├── useAdminData.js
│   │   │   ├── useUserDashboardData.js
│   │   │   └── useAttendanceBreakdown.js
│   │   ├── components/
│   │   │   ├── shell/
│   │   │   │   ├── AppShell.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── UserCard.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Icon.jsx
│   │   │   │   └── Feedback.jsx
│   │   │   ├── auth/
│   │   │   │   └── AuthPanel.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── OverviewPanel.jsx
│   │   │   │   ├── AttendancePanel.jsx
│   │   │   │   ├── AttendanceColumn.jsx
│   │   │   │   ├── UsersPanel.jsx
│   │   │   │   ├── LeavesPanel.jsx
│   │   │   │   └── ReportsPanel.jsx
│   │   │   └── user/
│   │   │       └── UserDashboardPage.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── eslint.config.js
│   └── vite.config.js
├── Server/                # backend API implementation
│   ├── config/            # env loader + Arcjet configuration
│   ├── controllers/
│   ├── database/
│   ├── middlewares/       # auth, Arcjet, and error handling
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── app.js
│   └── package.json
└── README.md
```

## Server Structure

- `Server/app.js` - main Express application
- `Server/config/env.js` - environment variable loader
- `Server/database/mongodb.js` - MongoDB connection helper
- `Server/config/arcjet.js` - Arcjet client configuration (rate limiting, bot detection)
- `Server/models/` - Mongoose schemas for each collection
- `Server/controllers/` - request handlers for API logic
- `Server/routes/` - route definitions and authorization wiring
- `Server/middlewares/` - authentication, Arcjet protection, and error handling
- `Server/scripts/seedData.js` - sample data seed script

## Client Structure

- `Client/index.html` - HTML entry point
- `Client/src/main.jsx` - React application entry point
- `Client/src/App.jsx` - root application component; wires the hooks below into the app shell and routes between the sign-in screen, the user dashboard, and the admin dashboard, and owns the admin/user navigation state
- `Client/src/index.css` - Tailwind CSS v4 entry point; defines the design tokens (brand palette, semantic surface/ink colors, light/dark overrides) and shared component classes (`.card`, `.btn-*`, `.field-input`, `.badge`, etc.)
- `Client/src/assets/` - static assets (images, icons)
- `Client/src/api/` - one module per backend resource (`auth`, `users`, `attendance`, `leaves`, `reports`); `client.js` holds the shared `fetch` wrapper (credentials, JSON headers, error normalization) that every other module builds on
- `Client/src/hooks/` - state and side effects, decoupled from rendering:
  - `useRoute` - lightweight pushState/popstate routing
  - `useAuth` - login/register form state, the signed-in `user`/`profile`, and the shared status `message`
  - `useTheme` - light/dark theme state; toggles the `dark` class on `<html>` and persists the choice to `localStorage`
  - `useAdminData` - admin dashboard summary, users, leave requests, today's attendance, and the related mutation actions
  - `useUserDashboardData` - the signed-in user's own attendance/leave history and the mark-attendance / request-leave actions
  - `useAttendanceBreakdown` - pure derivation of present / absent / on-leave / not-yet-marked lists from already-fetched data
- `Client/src/components/` - presentational components, grouped by area:
  - `shell/` - the app frame: `AppShell` (responsive layout with a collapsible mobile drawer), `Sidebar` (primary navigation), `Header` (page title, theme toggle, user menu), and `UserCard`/`Avatar`
  - `ui/` - shared primitives: `Icon` (inline SVG set) and `Feedback` (`StatusBadge`, `Banner`, `EmptyState`, `SectionCard`, `Spinner`)
  - `auth/`, `admin/`, `user/` - the feature areas; `admin/AttendanceColumn.jsx` is a shared render-prop component used for the present, absent, and on-leave lists
- `Client/vite.config.js` - Vite build configuration (React + Tailwind plugins)
- `Client/eslint.config.js` - ESLint configuration

## Getting Started

### Prerequisites

- Node.js 18+ (or latest stable)
- npm or pnpm
- MongoDB instance

### Backend Setup

1. Navigate to the server folder:

```bash
cd Server
```

2. Install dependencies:

```bash
npm install
```

3. Create or update the `.env.development.local` file with your database URI and JWT secret.

4. Start the development server:

```bash
npm run dev
```

The server listens on the port defined in `.env.development.local` (default: `5500`).

### Frontend Setup

1. Navigate to the client folder:

```bash
cd Client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

By default, Vite serves the frontend on `http://localhost:5173`. Ensure the backend is running so the frontend can communicate with the API.

## Seed Sample Data

A seed script exists at `Server/scripts/seedData.js`.

Run:

```bash
npm run seed
```

This will insert sample users, employees, students, attendance records, and leave requests into the configured MongoDB database.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`

### Users

- `GET /api/v1/users/` - admin only
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id` - admin only
- `DELETE /api/v1/users/:id` - admin only

### Attendance

- `POST /api/v1/attendance/mark` - marks the signed-in user for today; rejected with `409` if they are already marked or are on approved leave for the current day
- `GET /api/v1/attendance/` - admin only, scoped to today's date server-side
- `GET /api/v1/attendance/:id` - admin only
- `GET /api/v1/attendance/user/:id`
- `PUT /api/v1/attendance/:id` - admin only
- `DELETE /api/v1/attendance/:id` - admin only

### Leave

- `POST /api/v1/leaves/`
- `GET /api/v1/leaves/` - admin only
- `GET /api/v1/leaves/me` - the signed-in user's own leave history
- `PUT /api/v1/leaves/:id` - admin only
- `DELETE /api/v1/leaves/:id` - admin only
- `POST /api/v1/leaves/cancel/:id`

### Reports

- `GET /api/v1/reports/admin-dashboard` - admin only; powers the admin overview panel (total employees, present/absent today, late arrivals, pending leave, department count, monthly attendance chart)
- `GET /api/v1/reports/daily` - admin only
- `GET /api/v1/reports/monthly` - admin only
- `GET /api/v1/reports/student/:id`
- `GET /api/v1/reports/export/pdf` - admin only (not yet implemented)
- `GET /api/v1/reports/export/excel` - admin only

## Authentication & Authorization

- JWT is used for authentication.
- Tokens are returned on login and registration and may be stored in cookies or `Authorization` header.
- Protected routes use an `authorize` middleware.
- Admin-only routes use `isAdmin`.
- Arcjet middleware runs ahead of the route handlers to provide rate limiting and bot protection.

## Notes

- The `Client/` folder contains a React (Vite) frontend styled with Tailwind CSS v4, organized into `api/` (HTTP calls), `hooks/` (state/side effects), and `components/` (presentation, including a reusable `shell/` app frame and `ui/` primitives).
- The interface uses a sidebar app shell with a light/dark theme toggle; the chosen theme is persisted in `localStorage`.
- Users on approved leave for the current day are prevented from marking attendance. The rule is enforced in the attendance controller and mirrored in the user dashboard (the mark buttons are disabled with an explanatory notice).
- `reports/export/pdf` currently returns a `501 Not Implemented` response.
- Passwords are hashed before being stored.
- Error handling is centralized in `Server/middlewares/error.middleware.js`.

## Future Improvements

- Implement PDF report export
- Add better request validation and API documentation
- Expand role-based access control
- Add automated tests
