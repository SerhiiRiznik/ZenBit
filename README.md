# ZenBit

Full-stack test project with:

- `frontend` — React + TypeScript + Redux Toolkit + React Hook Form
- `backend` — NestJS + TypeORM + PostgreSQL + JWT auth (access + refresh cookie)

## Implemented

- Responsive landing page with deals grid (data from backend)
- Login / Register pages with field validation and backend error mapping to inputs
- Forgot password modal (UI stub)
- JWT auth flow:
  - access token in frontend state/localStorage
  - refresh token in `httpOnly` cookie
  - auto logout on `401`
- Shared styling system with global CSS variables

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

## Backend setup

1. Go to backend:

```bash
cd backend
npm install
```

2. Create `.env` in `backend/` and configure:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zenbit

DB_SSL=false
DB_MIGRATIONS_RUN=false

JWT_SECRET=dev-secret
JWT_REFRESH_SECRET=dev-refresh-secret
COOKIE_SECURE=false
```

3. Start backend:

```bash
npm run start:dev
```

Backend runs on `http://localhost:3001` by default.

## Frontend setup

1. Go to frontend:

```bash
cd frontend
npm install
```

2. Create `.env` in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API summary

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me` (JWT protected)

### Deals

- `GET /deals`
- `GET /deals/get`
- `GET /deals/get/:id`

## Scripts

### Frontend (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend (`backend/package.json`)

- `npm run start:dev`
- `npm run build`
- `npm run start:prod`
- `npm test`

## Notes

- Email validation is strict and synchronized on both frontend and backend.
- Refresh cookie is cleared on logout.
- CORS allows `FRONTEND_URL` and `http://localhost:3000`.
