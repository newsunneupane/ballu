const REVALIDATE_PATH = '/api/revalidate';

export async function revalidateCatalog(): Promise<void> {
  const publicSiteUrl = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!publicSiteUrl || !secret) {
    console.warn('[revalidate] Skipped: PUBLIC_SITE_URL / REVALIDATE_SECRET not configured');
    return;
  }

  try {
    const url = `${publicSiteUrl.replace(/\/+$/, '')}${REVALIDATE_PATH}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.warn(`[revalidate] Website rejected the request: ${res.status} ${res.statusText} (check that REVALIDATE_SECRET matches on both apps)`);
    }
  } catch (err) {
    console.warn(`[revalidate] Could not reach website at ${publicSiteUrl}: ${(err as Error).message}`);
  }
}