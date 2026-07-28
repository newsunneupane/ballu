# Ballu Jewellers — Admin Panel

Built with Next.js 16, TypeScript, Tailwind CSS, and Mongoose.

Self-contained app hosting the admin UI and all API routes (`/api/*`) that connect directly to MongoDB. All admin pages are protected by login.

## First-Time Setup

### 1. Seed the database

Creates admin user, materials, and categories:

```bash
curl -X POST http://localhost:3001/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"ballu-admin-2026","adminEmail":"admin@ballu.com","adminPassword":"admin123","adminName":"Admin"}'
```

Default login: **admin@ballu.com** / **admin123**

### 2. Login

Open `http://localhost:3001/login` and sign in with the credentials above.

## Pages

| Route | Page | Auth |
|---|---|---|
| `/login` | Sign in | — |
| `/` | Dashboard | ✅ |
| `/materials` | CRUD | ✅ |
| `/categories` | CRUD | ✅ |
| `/items` | CRUD with price | ✅ |
| `/daily-rates` | Rate history | ✅ |
| `/custom-requests` | Manage status | ✅ |
| `/item-inquiries` | Manage status | ✅ |
| `/store-settings` | Edit store info | ✅ |

## API Routes

| Endpoint | Methods | Auth |
|---|---|---|
| `/api/health` | GET | — |
| `/api/auth/login` | POST | — |
| `/api/auth/register` | POST | secret key |
| `/api/auth/me` | GET | Bearer token |
| `/api/materials` | GET, POST | POST protected |
| `/api/materials/[id]` | GET, PUT, DELETE | write protected |
| `/api/categories` | GET, POST | POST protected |
| `/api/categories/[id]` | GET, PUT, DELETE | write protected |
| `/api/items` | GET (+ computed price), POST | POST protected |
| `/api/items/[id]` | GET (+ computed price), PUT, DELETE | write protected |
| `/api/daily-rates` | GET, POST | POST protected |
| `/api/daily-rates/latest` | GET | — |
| `/api/daily-rates/[id]` | GET, PUT, DELETE | write protected |
| `/api/custom-requests` | GET (protected), POST (public) | GET protected |
| `/api/custom-requests/[id]` | GET, PUT, DELETE | all protected |
| `/api/item-inquiries` | GET (protected), POST (public) | GET protected |
| `/api/item-inquiries/[id]` | GET, PUT, DELETE | all protected |
| `/api/store-settings` | GET, PUT | PUT protected |

Price formula: `((weight + wastage) × dailyRate) + makingCharges − boutiqueDeduction + diamondValue`

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB on `mongodb://localhost:27017`)

## Run

```bash
npm run dev
```

Open `http://localhost:3001`

## Build

```bash
npm run build
npm start
```

## Known Issues

### DNS SRV resolution fails on Windows (`querySrv ECONNREFUSED`)

Node.js on this machine cannot resolve `mongodb+srv://` SRV records for Atlas hosts (PowerShell `Resolve-DnsName` works fine, but Node.js DNS returns `ECONNREFUSED`).

**Fix used:** The `.env.local` connection string uses the non-SRV format with explicit shard hosts instead of `mongodb+srv://`:

```
mongodb://user:pass@shard-00-00.xxx.mongodb.net:27017,shard-00-01.xxx.mongodb.net:27017,shard-00-02.xxx.mongodb.net:27017/dbname?ssl=true&retryWrites=true&w=majority&replicaSet=xxx&authSource=admin
```

If the cluster is recreated or shard hostnames change, run these commands to get the new values:

```bash
# Get SRV records (shard hosts)
node -e "const d=require('dns'); d.setServers(['8.8.8.8']); d.resolveSrv('_mongodb._tcp.YOUR_CLUSTER.mongodb.net',(e,r)=>console.log(JSON.stringify(r)))"

# Get TXT record (replicaSet name, authSource)
node -e "const d=require('dns'); d.setServers(['8.8.8.8']); d.resolveTxt('_mongodb._tcp.YOUR_CLUSTER.mongodb.net',(e,r)=>console.log(JSON.stringify(r)))"
```

Then update `MONGODB_URI` in `.env.local` with the new values.
