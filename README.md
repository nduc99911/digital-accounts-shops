# digital-accounts-shops

DivineShop-like storefront for selling digital accounts/keys.

## Local dev (Postgres)

### 1) Create `.env`
```bash
cp .env.example .env
```

### 2) Start Postgres
Use any Postgres instance you have (local install, VPS, etc.).

Create database:
- `digital_accounts_shops`

Default local DATABASE_URL example:
```
postgresql://postgres:postgres@localhost:5432/digital_accounts_shops?schema=public
```

### 3) Install deps
```bash
npm i
```

### 4) Migrate
```bash
npm run db:migrate
```

### 5) Run dev
```bash
npm run dev
```

## Admin
- URL: `/admin/login`
- Default credentials are read from `.env`:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`

## Notes
- This repo targets **Postgres** (not SQLite).
