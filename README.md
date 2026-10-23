# Society Gate Helper

A Ring-inspired smart gate and visitor management simulator built for residential communities. This project reimagines the front gate experience as a streamlined digital workflow where visitors, residents, and guards can collaborate in real time to approve, track, and manage arrivals.

# What the idea is

In most Indian apartment societies, every visitor and delivery goes through the guard. He calls the flat on an intercom, the resident says “send him up” or “no”, and a paper register records it. It gets messy when the resident isn’t home, when five delivery apps arrive in the same hour, or when the guard lets someone in without asking.

# Flow:

1. A visitor or delivery person presses the doorbell at the gate. Ring sends a button press webhook to your server.
2. Your server finds who the visit is for and sends the resident a notification with a snapshot and the visitor type: delivery, guest, or unknown.
3. The resident taps Approve, Deny, or Leave at gate.
4. The decision shows on the guard’s screen, with a plain message like “Flat 402: Zomato delivery approved”. It is also written to a log.
5. Pre-approvals: a resident can say “my cook comes 8 to 9am daily” or “Amazon delivery today”. Those visits are approved automatically, and anything unexpected goes to the resident.
6. A daily or weekly log gives the society a searchable visitor record.

## Overview

Society Gate Helper helps housing societies manage entry requests with a simple, secure, and intuitive interface. It combines:

- A guard desk for handling live arrivals
- Resident approval workflows for pending visitors
- Pre-approval rules for recurring visitor patterns
- A searchable visitor log for record keeping
- A realistic Ring-style event simulation to model gate activity

The application demonstrates how a modern smart-home ecosystem can improve gate operations, reduce manual coordination, and create a smoother experience for residents and security teams.

## Why this project

Traditional visitor management at gates is often manual and fragmented. Residents, security guards, and delivery personnel often need to coordinate over calls, messages, or paper logs. Society Gate Helper brings this into one digital system with a clear operational workflow and a clean interface inspired by modern smart home products.

## Features

- Smart gate overview dashboard with real-time visitor metrics
- Guard desk queue for pending visitor approvals
- Resident approvals for deciding whether to allow a visitor
- Pre-approval rules for recurring or scheduled visits
- Visitor record search and filters by status, name, flat, and visit type
- Simulated signed visitor events to model a Ring-like arrival flow
- Full-stack TypeScript architecture with shared validation and API contracts
- React + Vite frontend and Express backend
- PostgreSQL + Drizzle support for persistence-ready data models

## Architecture

This repository is organized as a TypeScript workspace:

- `artifacts/society-gate-helper` — frontend application
- `artifacts/api-server` — backend API
- `lib/db` — database layer and Drizzle schema
- `lib/api-zod` — shared validation schemas
- `lib/api-client-react` — generated React API client
- `lib/api-spec` — API contract definitions
- `scripts` — helper scripts

## Tech Stack

- TypeScript
- pnpm workspaces
- React + Vite
- Express
- PostgreSQL
- Drizzle ORM
- Zod validation
- Tailwind-based UI styling

## Live Demo

The app is live here:

https://society-gate-helper--shiviiiiji.replit.app

## Prerequisites

Make sure you have the following installed:

- Node.js 24 or newer
- pnpm
- PostgreSQL (for database-backed features)

## Installation

Clone the repository:

```bash
git clone https://github.com/ShivangiBhargava/Society-Gate-Helper.git
cd Society-Gate-Helper
corepack enable
pnpm install
```

## Environment Variables

Create environment variables before running the app.

Example:

```bash
# API server
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/society_gate_helper

# Frontend
PORT=5173
BASE_PATH=/
```

Notes:

- `PORT` is required by the API server and frontend
- `BASE_PATH` is required for the frontend app
- `DATABASE_URL` is required for database-backed features and schema pushes

## Running the Backend

From the project root:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Running the Frontend

From the project root:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/society-gate-helper run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Running Both Together

Open two terminals:

Terminal 1:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

Terminal 2:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/society-gate-helper run dev
```

## Type Checking

Run a project-wide TypeScript check:

```bash
pnpm run typecheck
```

## Production Build

Build the full workspace:

```bash
pnpm run build
```

Build only the frontend:

```bash
pnpm --filter @workspace/society-gate-helper run build
```

## Database Setup

If you need to push the Drizzle schema to PostgreSQL:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/society_gate_helper pnpm --filter @workspace/db run push
```

## Common Commands

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

## Project Workflow

The app supports a practical gate-operating workflow:

1. A visitor arrival is simulated or recorded
2. The guard desk views the pending visit
3. The resident receives a decision request
4. The resident approves, denies, or schedules a response
5. The action is logged for future record keeping
6. Repeat or recurring visits can be handled using pre-approval rules

This makes the app feel like a lightweight smart security dashboard designed for modern apartment communities.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
