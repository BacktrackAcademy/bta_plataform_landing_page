# Backtrack Academy — Landing page

Public marketing site: home, team, security, sponsorship, FAQ, legal pages and certificate validation.
The authenticated app (login, courses, dashboard) lives in `bta_plataform_front`.

## Setup

```bash
nvm use            # Node 22 (see .node-version)
cp .env.example .env
npm install
npm run dev        # http://localhost:4322
```

## Environment

| Variable | Purpose |
|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | Public API (`/landing/*` endpoints) |
| `NUXT_PUBLIC_PLATFORM_URL` | Base URL of the platform app; every link to login, sign-up, courses or dashboard is built from it (`usePlatformUrl`) |

## Scripts

`npm run build` · `npm run lint`
