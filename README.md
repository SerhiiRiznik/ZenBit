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
DB_SSL=true
DB_SYNCHRONIZE=true
JWT_SECRET=change-me-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false

POSTGRES_HOST=aws-1-eu-west-1.pooler.supabase.com
POSTGRES_PORT=6543
POSTGRES_USER=postgres.evgcaevbkzlhbngfirpa
POSTGRES_PASSWORD=r&P54h6bi_W%Lb.
POSTGRES_DB=postgres

AWS_REGION=
AWS_S3_BUCKET=
AWS_S3_PUBLIC_BASE_URL=
AWS_S3_ENDPOINT=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
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

## API Routes (Backend)

### /auth

- **POST /auth/register**
  - Body: `{ email, password, ... }` (CreateUserDto)
  - Response: `{ accessToken, user }` + sets refreshToken cookie

- **POST /auth/login**
  - Body: `{ email, password }` (LoginDto)
  - Response: `{ accessToken, user }` + sets refreshToken cookie

- **POST /auth/refresh**
  - Cookies: `refreshToken`
  - Response: `{ accessToken }` + updates refreshToken cookie
  - 401 if refreshToken is missing

- **POST /auth/logout**
  - Clears refreshToken cookie
  - Response: `{ success: true }`

- **GET /auth/me**
  - JWT authorization required
  - Response: `{ userId, email }`

### /users

- **POST /users**
  - Body: `{ email, password, ... }` (CreateUserDto)
  - Response: `{ id, createdAt }`

- **GET /users**
  - Response: array of users

### /applications

- **POST /applications**
  - Body: Application DTO + file (image, optional)
  - Response: created application

- **GET /applications**
  - Query: `limit`, `offset` (optional)
  - Response: array of applications

- **GET /applications/currencies**
  - Response: array of currencies

- **GET /applications/:id**
  - Param: `id`
  - Response: application

- **PATCH /applications/:id**
  - Param: `id`
  - Body: Application DTO + file (image, optional)
  - Response: updated application

- **DELETE /applications/:id**
  - Param: `id`
  - Response: delete result

- **GET /applications/:id/investments**
  - Param: `id`
  - Response: array of investments

- **POST /applications/:id/investments**
  - Param: `id`
  - Body: Investment DTO
  - Response: created investment

- **PATCH /applications/:applicationId/investments/:investmentId**
  - Param: `applicationId`, `investmentId`
  - Body: Investment DTO
  - Response: updated investment

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
