# Ballu Jewellers — Main Website

Built with Next.js 16, TypeScript, and Tailwind CSS.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/bridal` | Bridal collection |
| `/[collection]` | Dynamic collection pages (festive, daily-wear, engagement, office, gift) |
| `/catalogue` | Full catalogue with filters |
| `/catalogue/[id]` | Product detail |
| `/collections` | Collections overview |
| `/occasions` | Shop by occasion |
| `/personalize` | Commission form |
| `/stories` | Stories |
| `/visit` | Store info & about |

## Requirements

- Node.js 20+ (`node --version`)
- Admin panel API running at `http://localhost:3001` for live data (optional — falls back to static data)

## Setup

```bash
cd ballu/ballu-ts
npm install
cp .env.example .env.local # or create .env.local manually
```

## Data

Products are fetched from the admin panel API at `http://localhost:3001/api`.  
Set `NEXT_PUBLIC_API_URL` in `.env.local` to change the API origin.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If the API is unreachable, the site falls back to static product data.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`

## Build

```bash
npm run build
npm start
```
