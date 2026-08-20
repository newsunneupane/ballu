# Caching Playbook — "Load with the page, cache, revalidate on change"

A reusable guide for adding fast, production-grade caching to a Next.js public site
fed by an admin site + shared database. This is the exact pattern applied to
**ballu-ts** (public site) and **ballu-admin** (admin), adapted for any project.

---

## 1. The 3-layer idea

| Layer | Where | What it does | Effect |
|---|---|---|---|
| **L1 — Server data cache** | `unstable_cache` in `next/cache` | Caches DB reads + expensive price math for ~300s, tagged `catalog` | DB load drops from *per-visitor* to *per-5-minutes* |
| **L2 — Load with the page** | Server layout prefetch + React Query hydration + module store seeding | Data ships inside the HTML, no post-mount fetch | First paint is instant, no "Loading…" |
| **L3 — On-demand revalidation** | Admin webhook → `POST /api/revalidate` | Purges cache the moment data changes | Users see fresh data without waiting for the 300s window |

---

## 2. Layer 1 — Server-side cached data loaders

Create `src/lib/server/catalog-data.ts` (server-only path; import only from
server components and route handlers — it pulls in mongoose, so it can never
leak into the client bundle).

```ts
import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';

export const CATALOG_REVALIDATE_SECONDS = 300;
export const CATALOG_TAG = 'catalog';

export const getItemsData = unstable_cache(
  async () => {
    await connectDB();
    const items = await Item.find()
      .populate('collection', 'name')
      .populate('material', 'name')
      .sort({ createdAt: -1 })
      .lean();
    return items; // attach any expensive derived fields here (e.g. pricing)
  },
  ['catalog-items'],                       // stable cache key parts
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_TAG, 'catalog-items'] }
);

// One loader per resource: getCollectionsData, getMaterialsData,
// getGroupsData, getStoreSettingsData, getRatesData — same shape.
// Include the shared CATALOG_TAG on every loader so ONE webhook purges all.

// Convenience: fire all loaders in parallel
export async function loadCatalogData() {
  const [items, collections, materials, groups, storeSettings, rates] =
    await Promise.all([
      getItemsData(), getCollectionsData(), getMaterialsData(),
      getGroupsData(), getStoreSettingsData(), getRatesData(),
    ]);
  return { items, collections, materials, groups, storeSettings, rates };
}
```

**Rules of thumb**
- `unstable_cache` bodies must be **pure** (no `req`/`res`, no cookies, no user-specific data). Keyed by arguments; if a loader takes an id, pass it as an arg so the cache keys it.
- Put your heaviest computation here (pricing, aggregation). It runs once per window, not per visitor.
- Note: in Next 16, `revalidateTag(tag, 'seconds')` / `revalidateTag(tag, { expire: ... })` needs a second profile argument — check your installed Next version's signature in `node_modules/next/dist/server/web/spec-extension/revalidate.d.ts`.

---

## 3. Point the API routes at the loaders

Replace the raw DB queries in each public API route with the cached loader, drop
`force-dynamic` / `no-store`, and return a shared-cache header:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getMaterialsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const materials = await getMaterialsData();
    return NextResponse.json(materials, {
      headers: {
        'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
```

- `s-maxage` targets shared/CDN caches only — the browser ignores it, so end users never get a stuck-stale response.
- If a route supports query filters (e.g. `?material=...`), either load the full cached set and filter in memory, or pass the filter as a `unstable_cache` arg.

---

## 4. Layer 2 — Load the data with the page

### 4a. Prefetch + dehydrate React Query (server)

`src/lib/catalog-prefetch.ts` — must match the EXACT `queryKey`s your client
components use (check every `useQuery` key before writing this).

```ts
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getCollectionsData, getMaterialsData, getRatesData, getStoreSettingsData } from '@/lib/server/catalog-data';

export async function prefetchCatalogData() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['rates-current'],
      queryFn: () => getRatesData(),                    // return the SHAPE the client's queryFn returns
      staleTime: 60 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['store-settings'],
      queryFn: () => getStoreSettingsData(),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['onboarding-materials'],
      queryFn: () => getMaterialsData(),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['onboarding-collections'],
      queryFn: () => getCollectionsData(),
      staleTime: 5 * 60 * 1000,
    }),
  ]);
  return dehydrate(queryClient);
}
```

⚠️ **The single most common bug:** the dehydrated payload shape must be identical
to what the client `queryFn` returns. E.g. if the client does
`res.json()` on an endpoint that returns `{ rates: [...] }` and then maps
`data.rates`, prefetch `{ rates: await getRatesData() }` — not the bare array.
A mismatch causes `.map is not a function` at runtime.

### 4b. Seed a module-level store (optional, for non-React-Query data)

If client code keeps an in-memory store (e.g. `productService`), add a seed path:

```ts
let seeded = false;
export const productService = {
  seed(data: { items: any[]; collections: any[]; materials: any[]; groups: any[] }): void {
    if (data.items) productStore = data.items.map(transformApiItem);
    if (data.collections) collectionStore = data.collections;
    if (data.materials) materialStore = data.materials;
    if (data.groups) groupStore = data.groups;
    seeded = true;
  },
  isSeeded(): boolean { return seeded; },
  async ensureLoaded(): Promise<void> {
    if (seeded) return;                 // skip the old client fetch entirely
    await Promise.all([/* old fetches */]);
    seeded = true;
  },
  reset(): void { /* clear stores */ seeded = false; },
};
```

And the hook short-circuits once seeded:

```ts
export function useProductData() {
  const [ready, setReady] = useState<boolean>(() => isProductStoreSeeded());
  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    productService.ensureLoaded().then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [ready]);
  return ready;
}
```

### 4c. A client provider that seeds from props

`src/components/providers/CatalogStoreHydration.tsx`:

```tsx
'use client';
import { ReactNode, useMemo } from 'react';
import { productService } from '@/services/product-service';

export default function CatalogStoreHydration({
  items, collections, materials, groups, children,
}: { items: unknown[]; collections: unknown[]; materials: unknown[]; groups: unknown[]; children: ReactNode; }) {
  useMemo(() => {
    productService.seed({
      items: (items || []) as any[],
      collections: (collections || []) as any[],
      materials: (materials || []) as any[],
      groups: (groups || []) as any[],
    });
  }, [items, collections, materials, groups]);
  return <>{children}</>;
}
```

### 4d. Wire it all into the root layout (server component)

```tsx
import { HydrationBoundary } from '@tanstack/react-query';
import QueryProvider from '@/components/QueryProvider';
import CatalogStoreHydration from '@/components/providers/CatalogStoreHydration';
import { loadCatalogData } from '@/lib/server/catalog-data';
import { prefetchCatalogData } from '@/lib/catalog-prefetch';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ items, collections, materials, groups }, dehydratedState] = await Promise.all([
    loadCatalogData(),
    prefetchCatalogData(),
  ]);
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <HydrationBoundary state={dehydratedState}>
            <CatalogStoreHydration items={items} collections={collections} materials={materials} groups={groups}>
              {children}
            </CatalogStoreHydration>
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
```

Ordering matters: `HydrationBoundary` must sit **inside** `QueryClientProvider`
(QueryProvider), and the store seeding must run before the consumers render.

---

## 5. Layer 3 — On-demand revalidation from the admin

### 5a. Public site: `src/app/api/revalidate/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { CATALOG_TAG, STORE_SETTINGS_TAG } from '@/lib/server/catalog-data';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = req.headers.get('x-revalidate-secret');
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    revalidateTag(CATALOG_TAG);
    revalidateTag(STORE_SETTINGS_TAG);
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
```

### 5b. Admin site: fire-and-forget helper `src/lib/revalidateCatalog.ts`

Server-side only (used inside route handlers, never from the client bundle —
otherwise the secret leaks).

```ts
const REVALIDATE_PATH = '/api/revalidate';

export async function revalidateCatalog(): Promise<void> {
  const publicSiteUrl = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!publicSiteUrl || !secret) return;

  try {
    const url = `${publicSiteUrl.replace(/\/+$/, '')}${REVALIDATE_PATH}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      cache: 'no-store',
    });
  } catch {
    // Never block or fail the admin mutation because revalidation failed.
  }
}
```

### 5c. Call it after every successful mutation

In each admin create/update/delete route handler, right after the DB write
succeeds and before returning the response:

```ts
const item = await Item.create(body);
revalidateCatalog();          // fire-and-forget, not awaited
return NextResponse.json(item, { status: 201, headers: { 'Cache-Control': 'no-store' } });
```

Wire it into every route that mutates catalog resources (items, collections,
materials, groups, store-settings, bulk imports).

---

## 6. Environment variables

Public site (`.env.local` + Vercel dashboard):

```
REVALIDATE_SECRET=<long-random-string>
```

Admin site (`.env.local` + Vercel dashboard — NEVER `NEXT_PUBLIC_`):

```
PUBLIC_SITE_URL=https://your-public-site.vercel.app
REVALIDATE_SECRET=<the-same-long-random-string>
```

Generate a strong value:

```pwsh
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[System.Convert]::ToHexString($bytes)
```

---

## 7. Verification checklist

1. **Build both apps** (`npm run build`) — no type errors.
2. **Cache headers present:** `curl -I https://yoursite/api/materials` shows
   `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`.
3. **Page loads with data:** fetch the home HTML and grep for a seeded value
   (e.g. a product name in your language) — it must be present, meaning SSR
   rendered with data, no client fetch needed.
4. **Revalidation is guarded:** `POST /api/revalidate` with no header → `401`;
   with the correct `x-revalidate-secret` → `200 {"revalidated":true}`.
5. **Admin → public refresh:** make a change in admin, then immediately curl the
   public API — it returns the new data (cache purged).
6. **Hydration shape match:** if a page throws `.map is not a function`,
   your prefetch payload shape doesn't match the client `queryFn` — fix the shape.

---

## 8. Common pitfalls

- **Prefetch shape mismatch** (see §4a) — the #1 runtime bug.
- **Secrets in the client bundle** — only call `revalidateCatalog()` from server
  route handlers; never expose `REVALIDATE_SECRET` via `NEXT_PUBLIC_*`.
- **Not matching query keys** — if the client uses `['onboarding-materials']`,
  your prefetch must use the identical key or the cache won't hydrate.
- **Putting non-deterministic data in `unstable_cache`** — user-specific,
  cookie-driven, or date-relative reads break caching. Cache only shared catalog data.
- **`revalidateTag` signature** — newer Next may require a 2nd arg (profile).
  Check `revalidate.d.ts` in your installed Next version.
- **Heavy pricing math per request** — this is exactly what belongs in the
  loader, so it runs once per window instead of per visitor.
- **Don't cache admin/private pages** — admin routes keep `force-dynamic`
  + `no-store`. Caching is only for the public, shared catalog.

---

## 9. Expected outcome

| Metric | Before | After |
|---|---|---|
| DB queries per 100 visitors / 10 min | ~600 | ~6 |
| Home page HTML | server-rendered per hit | served from CDN (function skipped) |
| First paint on catalogue | "Loading…" + 4 fetches | data already in HTML |
| Freshness after admin edit | up to next request (no cache) | instant via webhook |

This pattern is portable to any Next.js public+admin pair with a shared database.
Adjust `CATALOG_REVALIDATE_SECONDS` and the cache tags to match your data
sensitivity (rates can be 1h, catalog 5m, settings 5m).