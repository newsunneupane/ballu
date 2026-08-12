export const TOLA_TO_GRAMS = 11.664;

export function tolaToGrams(tola: number): number {
  return tola * TOLA_TO_GRAMS;
}

export function gramsToTola(grams: number): number {
  return grams / TOLA_TO_GRAMS;
}
