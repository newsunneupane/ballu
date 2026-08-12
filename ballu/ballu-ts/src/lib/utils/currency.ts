export type CurrencyCode = 'NPR' | 'INR';

export const INR_PER_NPR_DIVISOR = 1.6;

export function countryToCurrency(countryCode: string | null | undefined): CurrencyCode {
  return countryCode === 'IN' ? 'INR' : 'NPR';
}

export function convertNprTo(npr: number, currency: CurrencyCode): number {
  return currency === 'INR' ? npr / INR_PER_NPR_DIVISOR : npr;
}

export function formatCurrency(npr: number, currency: CurrencyCode): string {
  const value = Math.round(convertNprTo(npr, currency));
  const symbol = currency === 'INR' ? '₹' : 'Rs';
  return `${symbol} ${value.toLocaleString('en-IN')}`;
}
