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

/** Fallback label when admin leaves it blank, e.g. 10g */
export function defaultVariantLabel(weightGrams: number): string {
  const rounded = Math.round(weightGrams * 1000) / 1000;
  return `${rounded}g`;
}

/**
 * Normalize variants for storage/response.
 * - Returns [] when no variants supplied (caller falls back to weightGrams).
 * - Trims labels, coerces numbers, drops invalid rows.
 */
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

/** Variants guaranteed non-empty: stored variants or single from weightGrams. */
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

/** Returns an error message when variants are invalid, else null. */
export function validateVariants(rawVariants: unknown): string | null {
  if (rawVariants == null) return null;
  if (!Array.isArray(rawVariants)) return 'Variants must be an array';
  if (rawVariants.length > MAX_VARIANTS) return `At most ${MAX_VARIANTS} variants allowed`;
  const seen = new Set<string>();
  for (let i = 0; i < rawVariants.length; i++) {
    const r = (rawVariants[i] || {}) as VariantInput;
    const w = toNumberOrUndefined(r.weightGrams);
    if (w == null || w <= 0) return `Variant ${i + 1}: valid weight is required`;
    if (typeof r.label === 'string' && r.label.length > 24) return `Variant ${i + 1}: label too long`;
    const key = (typeof r.label === 'string' && r.label.trim() ? r.label.trim() : defaultVariantLabel(w)).toLowerCase();
    if (seen.has(key)) return `Variant labels must be unique ("${key}")`;
    seen.add(key);
    const manual = toNumberOrUndefined(r.manualPriceNpr);
    if (r.manualPriceNpr != null && r.manualPriceNpr !== '' && manual == null) {
      return `Variant ${i + 1}: invalid manual price`;
    }
  }
  return null;
}
