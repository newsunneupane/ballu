export interface VariantInput {
  label?: unknown;
  weightGrams?: unknown;
  manualPriceNpr?: unknown;
  isAvailable?: unknown;
}

export interface NormalizedVariant {
  label: string;
  weightGrams: number;
  manualPriceNpr?: number;
  isAvailable: boolean;
}

export const MAX_VARIANTS = 12;

function toNumberOrUndefined(v: unknown): number | undefined {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function defaultVariantLabel(weightGrams: number): string {
  const rounded = Math.round(weightGrams * 1000) / 1000;
  return `${rounded}g`;
}

export function normalizeVariants(
  weightGrams: unknown,
  rawVariants: unknown
): NormalizedVariant[] {
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) return [];
  const out: NormalizedVariant[] = [];
  for (const raw of rawVariants.slice(0, MAX_VARIANTS)) {
    const r = (raw || {}) as VariantInput;
    const w = toNumberOrUndefined(r.weightGrams);
    if (w == null || w <= 0) continue;
    const manual = toNumberOrUndefined(r.manualPriceNpr);
    const label =
      typeof r.label === 'string' && r.label.trim()
        ? r.label.trim().slice(0, 24)
        : defaultVariantLabel(w);
    out.push({
      label,
      weightGrams: w,
      ...(manual != null ? { manualPriceNpr: manual } : {}),
      isAvailable: r.isAvailable !== false,
    });
  }
  return out;
}

export function withFallbackVariants(
  weightGrams: unknown,
  rawVariants: unknown
): NormalizedVariant[] {
  const normalized = normalizeVariants(weightGrams, rawVariants);
  if (normalized.length > 0) return normalized;
  const w = toNumberOrUndefined(weightGrams);
  if (w == null || w <= 0) return [];
  return [{ label: defaultVariantLabel(w), weightGrams: w, isAvailable: true }];
}
