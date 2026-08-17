export const TOLA_TO_GRAMS = 11.664;

export const INR_PER_NPR_DIVISOR = 1.6;

export function nprToInr(npr: number): number {
  return Math.round((npr / INR_PER_NPR_DIVISOR) * 100) / 100;
}

export function tolaToGrams(tola: number): number {
  return tola * TOLA_TO_GRAMS;
}

export function gramsToTola(grams: number): number {
  return grams / TOLA_TO_GRAMS;
}
