// Simple rate limiting to prevent quota exhaustion
const rateLimitMap = new Map();

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute per IP

  const key = ip;
  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      message: "Too many requests. Please wait a moment before asking another question. For immediate assistance, contact Revogreen Energy Hub at 07067844630."
    };
  }

  record.count++;
  rateLimitMap.set(key, record);
  return { allowed: true };
}

export function getClientIP(request: any): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || real || 'unknown';
}