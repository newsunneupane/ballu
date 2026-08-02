# Ballu Jewellers — Main Website

Built with Next.js 16, TypeScript, and Tailwind CSS.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/bridal` | Bridal collection |
| `/[category]` | Dynamic category pages (festive, daily-wear, engagement, office, gift) |
| `/catalogue` | Full catalogue with filters |
| `/catalogue/[id]` | Product detail |
| `/personalize` | Commission form |
| `/stories` | Stories |
| `/visit` | Store info & about |

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
