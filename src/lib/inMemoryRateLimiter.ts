
// src/lib/inMemoryRateLimiter.ts

// Simple in-memory store for IP request counts.
// WARNING: This data will be lost if the server instance restarts or if you scale to multiple instances.
const ipRequestCounts = new Map<string, { count: number; windowStart: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 20; // Max requests per IP per window

// Function to periodically clean up old entries from the map
function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      ipRequestCounts.delete(ip);
    }
  }
}

// Run cleanup periodically (e.g., every 30 minutes)
// This interval will only run as long as the server process is alive.
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') { // Avoid running in test environments or client-side
  setInterval(cleanupOldEntries, RATE_LIMIT_WINDOW_MS / 2);
}


export function checkInMemoryRateLimit(ip: string | null): { allowed: boolean; message: string; retryAfter?: number } {
  if (!ip) {
    // If IP address is not available, we cannot enforce IP-based rate limiting.
    // Depending on policy, you might allow, deny, or use a different fallback.
    // For this example, we'll allow it but log a warning.
    console.warn('Rate limiter: IP address not provided. Allowing request by default.');
    return { allowed: true, message: '' };
  }

  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (record) {
    // Check if the current window is still valid
    if (now - record.windowStart < RATE_LIMIT_WINDOW_MS) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        const timeLeftMs = RATE_LIMIT_WINDOW_MS - (now - record.windowStart);
        return {
          allowed: false,
          message: `You have exceeded the request limit. Please try again in about ${Math.ceil(timeLeftMs / (1000 * 60))} minutes.`,
          retryAfter: timeLeftMs,
        };
      }
      // Increment count within the current window
      record.count++;
      ipRequestCounts.set(ip, record); // Update the record
      return { allowed: true, message: '' };
    } else {
      // Window has expired, reset count and windowStart
      ipRequestCounts.set(ip, { count: 1, windowStart: now });
      return { allowed: true, message: '' };
    }
  } else {
    // No record for this IP, start a new window
    ipRequestCounts.set(ip, { count: 1, windowStart: now });
    return { allowed: true, message: '' };
  }
}
