'use client';

const RECENT_KEY = 'bj_recently_viewed';
const AFFINITY_KEY = 'bj_affinity';
const MAX_RECENT = 20;

interface Affinity {
  collection: Record<string, number>;
  material: Record<string, number>;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function recordView(item: { id: string | number; collection: string; material: string }): void {
  if (typeof window === 'undefined') return;

  const recent = safeParse<(string | number)[]>(localStorage.getItem(RECENT_KEY), []);
  const nextRecent = [item.id, ...recent.filter((id) => String(id) !== String(item.id))].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));

  const affinity = safeParse<Affinity>(localStorage.getItem(AFFINITY_KEY), { collection: {}, material: {} });
  affinity.collection[item.collection] = (affinity.collection[item.collection] || 0) + 1;
  affinity.material[item.material] = (affinity.material[item.material] || 0) + 1;
  localStorage.setItem(AFFINITY_KEY, JSON.stringify(affinity));
}

export function getRecentlyViewed(): (string | number)[] {
  if (typeof window === 'undefined') return [];
  return safeParse<(string | number)[]>(localStorage.getItem(RECENT_KEY), []);
}

function topKey(counts: Record<string, number>): string | undefined {
  const entries = Object.entries(counts);
  if (entries.length === 0) return undefined;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function getAffinity(): { collection?: string; material?: string } {
  if (typeof window === 'undefined') return {};
  const affinity = safeParse<Affinity>(localStorage.getItem(AFFINITY_KEY), { collection: {}, material: {} });
  return {
    collection: topKey(affinity.collection),
    material: topKey(affinity.material),
  };
}

export function hasSeenOnboarding(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem('bj_onboarding_seen') === '1';
}

export function markOnboardingSeen(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('bj_onboarding_seen', '1');
}
