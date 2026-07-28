export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(amount);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
