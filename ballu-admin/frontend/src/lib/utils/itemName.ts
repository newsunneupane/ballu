export function stripCountFromName(name: string): string {
  return (name || '').trim().replace(/\s+(?:\(\d+\)|\d+)$/, '');
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function countSuffixPattern(): string {
  return '(?:\\s+\\(\\d+\\)|\\s+\\d+)?';
}