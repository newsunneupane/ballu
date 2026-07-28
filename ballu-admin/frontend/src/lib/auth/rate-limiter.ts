interface Attempt {
  count: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

export function checkRateLimit(email: string): { allowed: boolean; message?: string } {
  const key = email.toLowerCase();
  const now = Date.now();
  const record = attempts.get(key);

  if (record?.lockedUntil && now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, message: `Too many attempts. Try again in ${remaining} minute${remaining === 1 ? '' : 's'}.` };
  }

  if (record?.lockedUntil && now >= record.lockedUntil) {
    attempts.delete(key);
  }

  return { allowed: true };
}

export function recordFailedAttempt(email: string): void {
  const key = email.toLowerCase();
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, lockedUntil: null };

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
    record.count = 0;
  }

  attempts.set(key, record);
}

export function resetAttempts(email: string): void {
  attempts.delete(email.toLowerCase());
}
