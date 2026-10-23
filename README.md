# Society Gate Helper

Society Gate Helper is a full-stack TypeScript workspace for a society gate management application. The project includes a React + Vite frontend, an Express API server, and shared packages for the database and API contracts.

## Project structure

- `artifacts/society-gate-helper` — frontend application
- `artifacts/api-server` — backend API
- `lib/db` — database package with Drizzle schema
- `lib/api-zod` — shared validation schemas
- `lib/api-client-react` — generated React API client
- `lib/api-spec` — API contract definitions
- `scripts` — helper scripts

## Tech stack

- TypeScript
- pnpm workspaces
- React + Vite
- Express
- PostgreSQL + Drizzle ORM
- Zod validation

## Prerequisites

Make sure you have the following installed:

- Node.js 24 or newer
- pnpm
- PostgreSQL database (if you are using the DB package or backend features)

## Installation

From the repository root:

```bash
git clone https://github.com/ShivangiBhargava/Society-Gate-Helper.git
cd Society-Gate-Helper
corepack enable
pnpm install
```

## Environment variables

Create environment variables before running the app.

### Example environment file

```bash
# For the API server
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/society_gate_helper

# For the frontend
PORT=5173
BASE_PATH=/
```

Notes:
- `PORT` is required by both the API server and the Vite frontend.
- `BASE_PATH` is required by the frontend app.
- `DATABASE_URL` is required if you are using database-backed features or pushing schema changes.

## Run the backend

From the repo root:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

The API server starts on:

```text
http://localhost:5000
```

## Run the frontend

From the repo root:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/society-gate-helper run dev
```

The frontend app starts on:

```text
http://localhost:5173
```

## Run both together

Open two terminals and run:

Terminal 1:
```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

Terminal 2:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/society-gate-helper run dev
```

## Type checking

Run the project-wide TypeScript check:

```bash
pnpm run typecheck
```

## Production build

Build all packages:

```bash
pnpm run build
```

To build just the frontend:

```bash
pnpm --filter @workspace/society-gate-helper run build
```

## Database setup

If you need to push the Drizzle schema to PostgreSQL:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/society_gate_helper pnpm --filter @workspace/db run push
```

## Common commands

```bash
# Install dependencies
pnpm install

# Type check
pnpm run typecheck

# Build everything
pnpm run build

# Start frontend
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/society-gate-helper run dev

# Start backend
PORT=5000 pnpm --filter @workspace/api-server run dev
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
