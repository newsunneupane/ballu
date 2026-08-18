const REVALIDATE_PATH = '/api/revalidate';

export async function revalidateCatalog(): Promise<void> {
  const publicSiteUrl = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!publicSiteUrl || !secret) return;

  try {
    const url = `${publicSiteUrl.replace(/\/+$/, '')}${REVALIDATE_PATH}`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    });
  } catch {
    // Never block or fail admin mutations because revalidation failed.
  }
}