# Cloudinary Setup & Image Handling

This document explains how images are uploaded, stored, and rendered across the
**admin app** (`ballu-admin`) and the **public site** (`ballu-ts`) using Cloudinary.

## Cloudinary account

A Cloudinary account provides three credentials used across both apps:

| Credential               | Example                          | Where it lives                              |
| ------------------------ | -------------------------------- | ------------------------------------------- |
| Cloud name               | `ob2ocgd1`                       | `.env.local` in both apps (public, safe)    |
| API Key                  | *(server-side, from `.env.local`)* | Admin `.env.local` (server-side only)     |
| API Secret               | *(server-side, from `.env.local`)* | Admin `.env.local` (server-side only)     |

API Key/Secret must **never** be committed to git or exposed to the browser.
They are read only inside Next.js Route Handlers (`app/api/**/route.ts`).

## Environment variables

### Admin app — `ballu-admin/frontend/.env.local`

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ob2ocgd1
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### Public site — `ballu/ballu-ts/.env.local`

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ob2ocgd1
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

Both files are gitignored.

## How it works

### 1. Upload (admin → Cloudinary)

- The admin "Items" form uploads images through the protected route
  `src/app/api/upload/route.ts` (admin app). It requires the admin JWT
  (`requireAuth`), accepts a base64 image, and returns `{ url, public_id }`.
- Uploads go to the folder `ballu/items` with `quality:auto`.
- The returned **URL** is what gets stored in MongoDB in the `Item.images`
  array. No binary data is ever saved to the database.

### 2. Upload (public bespoke form → Cloudinary)

- The bespoke custom-request form uploads via
  `src/app/api/upload/route.ts` (public site, no auth needed).
- Images go to the folder `ballu/custom-requests` and the URL is stored on the
  `CustomRequest.images` array instead of a base64 string.

### 3. Serving beautiful, center-cropped images

Both apps share an identical helper: `src/lib/cloudinary.ts`

```ts
cloudinaryUrl(src, { width: 600, aspect: '3:4' })
```

It transforms a Cloudinary URL with:

- `ar_<ratio>` — exact aspect ratio (the crop shape)
- `c_fill,g_center` — **center crop** (crops the middle of the image to fill)
- `e_sharpen` — sharpen the image
- `q_auto:good` — automatic quality
- `f_auto` — automatic format (WebP/AVIF)
- `dpr_auto` — device pixel ratio

If an uploaded image's aspect ratio already matches the requested one, it is
rendered uncropped (just resized to fill); otherwise it is center-cropped to
fit.

Aspect ratios used per section:

| Location                           | Aspect ratio |
| ---------------------------------- | ------------ |
| Catalogue grid card                | `3:4`        |
| Product detail page                | `4:5`        |
| Hero "Piece of the Week" card      | `4:3`        |
| Search overlay thumbnail           | `1:1`        |
| Admin table / settings thumbnails  | `1:1`        |

Recommended admin upload size for item images: **1200 × 1500 px (4:5 portrait)**.

Non-Cloudinary URLs (e.g. legacy images) pass through the helper unchanged, so
old records keep working.

## Files changed

- `ballu-admin/frontend/src/app/api/upload/route.ts` — admin signed upload
- `ballu-admin/frontend/src/lib/cloudinary.ts` — URL transform helper
- `ballu-admin/frontend/src/lib/api.ts` — added `api.upload.image()`
- `ballu-admin/frontend/src/app/items/page.tsx` — image picker UI + previews
- `ballu-admin/frontend/src/app/store-settings/page.tsx` — thumbnail helper
- `ballu-admin/frontend/src/app/item-inquiries/page.tsx` — thumbnail helper
- `ballu-admin/frontend/src/app/custom-requests/page.tsx` — thumbnail helper
- `ballu/ballu-ts/src/app/api/upload/route.ts` — public bespoke upload
- `ballu/ballu-ts/src/lib/cloudinary.ts` — URL transform helper
- `ballu/ballu-ts/src/components/shared/ProductCard.tsx` — card images
- `ballu/ballu-ts/src/app/catalogue/[id]/page.tsx` — detail image
- `ballu/ballu-ts/src/components/sections/HeroSection.tsx` — hero image
- `ballu/ballu-ts/src/components/layout/SearchOverlay.tsx` — search thumbnail
- `ballu/ballu-ts/src/app/bespoke/page.tsx` — upload to Cloudinary (no base64)

## Troubleshooting

- **`Cloudinary is not configured`** — the env vars above are missing or not
  loaded. Restart the dev server after editing `.env.local`.
- **`Not authenticated`** — the admin upload route requires a valid JWT; log
  into the admin app first.
- **Old images still work** — non-Cloudinary URLs are returned unchanged by
  `cloudinaryUrl`, so no migration is required.
