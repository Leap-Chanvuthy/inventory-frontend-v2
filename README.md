# Inventory v2 — Frontend

A modern inventory management system built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS v3**, and **shadcn/ui**. Served in production via a multi-stage Docker image using Nginx.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Environment variables](#3-environment-variables)
  - [4. Start the dev server](#4-start-the-dev-server)
- [Available Scripts](#available-scripts)
- [Docker Setup](#docker-setup)
  - [Build and run with Docker Compose](#build-and-run-with-docker-compose)
  - [Build the image manually](#build-the-image-manually)
  - [Run the container manually](#run-the-container-manually)
  - [Useful Docker commands](#useful-docker-commands)
- [Environment Variables Reference](#environment-variables-reference)
- [CI / CD](#ci--cd)
- [Production Notes](#production-notes)

---

## Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v3 + shadcn/ui + Radix UI |
| State management | Redux Toolkit + Redux Persist |
| Server state | TanStack React Query v5 |
| Routing | React Router DOM v7 |
| Forms & validation | React Hook Form + Zod |
| HTTP client | Axios |
| Charts | Recharts |
| Maps | React Leaflet |
| Animations | Framer Motion |
| Linting | ESLint 9 + TypeScript-ESLint |
| Production server | Nginx 1.27 (Alpine) |
| Containerisation | Docker (multi-stage build) |

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 20.x |
| npm | 10.x (bundled with Node 20) |
| Docker | 24.x |
| Docker Compose | v2 (plugin, `docker compose`) |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.  
> Run `nvm use 20` or `nvm install 20` to switch to Node 20.

---

## Project Structure

```
frontend-v2/
├── public/               # Static assets (copied as-is to dist/)
├── src/
│   ├── api/              # Axios instances & API call functions
│   ├── components/       # Shared / reusable UI components
│   ├── consts/           # App-wide constants
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility helpers (cn, formatters, …)
│   ├── pages/            # Route-level page components
│   ├── redux/            # Redux store, slices, and persistor config
│   ├── utils/            # Pure utility functions
│   ├── App.tsx           # Root component & router setup
│   └── main.tsx          # Entry point
├── .env.example          # Environment variable template
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Compose file for production deployment
├── nginx.conf            # Nginx config for SPA serving
└── vite.config.ts        # Vite configuration
```

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd inventory-v2/frontend-v2
```

### 2. Install dependencies

```bash
npm ci
```

> Use `npm ci` (not `npm install`) to install exact versions from `package-lock.json`.

### 3. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Full base URL for authenticated API requests | `http://localhost:8000/api` |
| `VITE_BASE_API_URL` | Base URL used for non-prefixed requests | `http://localhost:8000` |

> All Vite environment variables **must** be prefixed with `VITE_` to be exposed to the browser bundle.

### 4. Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** with Hot Module Replacement (HMR) enabled.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Type-check with `tsc` then bundle for production into `dist/` |
| `npm run preview` | Serve the production `dist/` build locally (port 4173) |
| `npm run lint` | Run ESLint across all source files |

---

## Docker Setup

The `Dockerfile` uses a **two-stage build**:

1. **Builder** (`node:20-alpine`) — installs dependencies and runs `vite build`
2. **Production** (`nginx:1.27-alpine`) — serves the compiled `dist/` with a hardened Nginx config

### Build and run with Docker Compose

This is the recommended way to run the production image:

```bash
# 1. Create a .env file with your production values
cp .env.example .env

# 2. Build the image and start the container
docker compose up -d --build

# 3. Check container status
docker compose ps

# 4. View logs
docker compose logs -f
```

The app will be available at **http://localhost:80**.

> To change the port, edit the `ports` mapping in `docker-compose.yml`:
> ```yaml
> ports:
>   - "3000:80"   # host:container
> ```

### Build the image manually

```bash
docker build \
  --target production \
  --build-arg VITE_API_URL=https://api.yourdomain.com/api \
  --build-arg VITE_BASE_API_URL=https://api.yourdomain.com \
  -t inventory-v2-frontend:latest \
  .
```

### Run the container manually

```bash
docker run -d \
  --name inventory-frontend \
  -p 80:80 \
  --restart unless-stopped \
  inventory-v2-frontend:latest
```

### Useful Docker commands

```bash
# Stop the container
docker compose down

# Rebuild from scratch (no cache)
docker compose build --no-cache

# Tail container logs
docker compose logs -f frontend

# Open a shell inside the running container
docker compose exec frontend sh

# Check Nginx config inside the container
docker compose exec frontend nginx -t

# Remove stopped containers and dangling images
docker system prune -f
```

---

## Environment Variables Reference

Vite embeds environment variables **at build time**. They must be provided as Docker build arguments (`--build-arg`) so they are baked into the static bundle.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Full URL for API requests (e.g. `https://api.yourdomain.com/api`) |
| `VITE_BASE_API_URL` | Yes | Base server URL without path prefix (e.g. `https://api.yourdomain.com`) |

**Important:** Never commit `.env`, `.env.local`, or `.env.production` to version control. These files are listed in `.dockerignore` and should be in `.gitignore`.

---

## CI / CD

A GitHub Actions workflow is located at [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml).

### Pipeline overview

```
Push to main / Pull Request
        │
        ▼
┌─────────────────────┐
│  Lint & Build Check  │  ← runs on every push and PR
│  (eslint + tsc+vite) │
└──────────┬──────────┘
           │ merge to main only
           ▼
┌─────────────────────┐
│ Build & Push Image   │  ← builds Docker image, pushes to ghcr.io
│ (ghcr.io)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Deploy to VPS       │  ← SSH into VPS, docker compose pull & up
└─────────────────────┘
```

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP address or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | Full private SSH key (PEM format) |
| `VPS_DEPLOY_PATH` | Absolute path to the folder with `docker-compose.yml` on the VPS |
| `VITE_API_URL` | Production API URL (baked into the Docker image at build time) |
| `VITE_BASE_API_URL` | Production base API URL |
| `DEPLOY_URL` | _(Optional)_ Your public site URL — shown in the Actions environment badge |
| `VPS_PORT` | _(Optional)_ SSH port if not `22` |

> `GITHUB_TOKEN` is provided automatically by GitHub — no manual setup needed for pushing to `ghcr.io`.

---

## Production Notes

- **SPA routing** — Nginx is configured with `try_files $uri $uri/ /index.html` so all client-side routes work correctly on hard refresh.
- **Caching** — Vite-generated assets (hashed filenames) are cached for 1 year. `index.html` is set to `no-store` so new deployments take effect immediately.
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `HSTS`, and `Permissions-Policy` are all set in `nginx.conf`.
- **Rate limiting** — Nginx limits each IP to 100 requests/second (burst 200) to protect against traffic spikes.
- **Gzip** — Compression is enabled for JS, CSS, fonts, SVG, JSON, and XML assets.
- **Health check** — The Docker container includes a built-in health check (`wget http://localhost/`) that runs every 30 seconds.
