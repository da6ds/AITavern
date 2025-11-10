import rateLimit from 'express-rate-limit';

// General API rate limiter - prevents abuse
export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour per IP
  message: { error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[RateLimit] General limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests. Please try again in a few minutes.',
      retryAfter: Math.ceil((req.rateLimit?.resetTime?.getTime() || Date.now()) / 1000),
    });
  },
});

// AI endpoint rate limiter - more restrictive for expensive operations
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per hour per IP
  message: { error: 'Too many AI requests. Please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime;
    const minutesUntilReset = resetTime 
      ? Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60))
      : 60;
    
    console.log(`[RateLimit] AI limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: `You've used your AI request limit. Please try again in ${minutesUntilReset} minutes.`,
      limit: 20,
      window: '1 hour',
      retryAfter: Math.ceil((resetTime?.getTime() || Date.now()) / 1000),
    });
  },
});

// Strict limiter for very expensive operations (image generation, bulk operations)
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 requests per hour
  message: { error: 'Rate limit exceeded for this operation.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[RateLimit] Strict limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'This operation has a strict rate limit. Please try again later.',
      limit: 5,
      window: '1 hour',
    });
  },
});
