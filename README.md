# Attendance Management System

A full-stack attendance and leave management system built with a Node.js/Express backend and MongoDB data storage. The current workspace contains a working `Server` backend and an empty `Client` folder reserved for future frontend work.

## Project Status

- Backend API is implemented in `Server/`
- Data models for `User`, `Employee`, `Student`, `Attendance`, and `Leave` are defined with Mongoose
- Authentication, authorization, attendance tracking, leave requests, and reporting routes are available
- Seed data script added for local testing
- Client folder is currently empty

## Technologies

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- cookie-parser
- nodemon (development)

## Repository Structure

```
ManagementSystem/
├── Client/                # frontend placeholder
├── Server/                # backend API implementation
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
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
- `Server/models/` - Mongoose schemas for each collection
- `Server/controllers/` - request handlers for API logic
- `Server/routes/` - route definitions and authorization wiring
- `Server/middlewares/` - authentication and error handling
- `Server/scripts/seedData.js` - sample data seed script

## Getting Started

### Prerequisites

- Node.js 18+ (or latest stable)
- npm or pnpm
- MongoDB instance

### Setup

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

- `POST /api/v1/attendance/mark`
- `GET /api/v1/attendance/` - admin only
- `GET /api/v1/attendance/:id` - admin only
- `GET /api/v1/attendance/user/:id`
- `PUT /api/v1/attendance/:id` - admin only
- `DELETE /api/v1/attendance/:id` - admin only

### Leave

- `POST /api/v1/leaves/`
- `GET /api/v1/leaves/` - admin only
- `PUT /api/v1/leaves/:id` - admin only
- `DELETE /api/v1/leaves/:id` - admin only
- `POST /api/v1/leaves/cancel/:id`

### Reports

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

## Notes

- The `Client/` folder is currently empty and is a placeholder for a future frontend.
- `reports/export/pdf` currently returns a `501 Not Implemented` response.
- Passwords are hashed before being stored.
- Error handling is centralized in `Server/middlewares/error.middleware.js`.

## Future Improvements

- Add frontend implementation in `Client/`
- Implement PDF report export
- Add better request validation and API documentation
- Improve role-based access control
- Add tests
