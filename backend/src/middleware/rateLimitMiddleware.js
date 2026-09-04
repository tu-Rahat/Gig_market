"use strict";

/**
 * Authentication Rate Limiting Middleware
 * 
 * Protects against brute force attacks on:
 * - Login
 * - Registration
 * - Password reset
 * - 2FA verification
 * 
 * Uses in-memory store (Redis recommended for production)
 */

// In-memory store for tracking attempts
const attemptStore = new Map();

/**
 * Clean up expired entries (run periodically)
 */
const cleanupExpiredEntries = () => {
    const now = Date.now();
    for (const [key, data] of attemptStore.entries()) {
        if (now > data.expiresAt) {
            attemptStore.delete(key);
        }
    }
};

// Cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Rate limit middleware factory
 * 
 * @param {Object} options - Configuration
 * @param {string} options.endpoint - Endpoint name for logs (e.g., 'login', 'register')
 * @param {number} options.maxAttempts - Max attempts before lockout (default: 5)
 * @param {number} options.windowMinutes - Time window in minutes (default: 15)
 * @param {Function} options.keyFn - Function to extract rate limit key from req
 * @returns {Function} - Express middleware
 */
const rateLimit = (options = {}) => {
    const {
        endpoint = 'auth',
        maxAttempts = 5,
        windowMinutes = 15,
        keyFn = (req) => req.ip || 'unknown'
    } = options;

    const windowMs = windowMinutes * 60 * 1000;

    return (req, res, next) => {
        try {
            const key = `${endpoint}:${keyFn(req)}`;
            const now = Date.now();

            let record = attemptStore.get(key);

            // Initialize or reset if expired
            if (!record || now > record.expiresAt) {
                record = {
                    attempts: 0,
                    firstAttempt: now,
                    expiresAt: now + windowMs
                };
                attemptStore.set(key, record);
            }

            // Increment attempts
            record.attempts++;

            // Calculate remaining attempts
            const attemptsRemaining = Math.max(0, maxAttempts - record.attempts);

            // Attach to request for potential use in response
            req.rateLimit = {
                attempts: record.attempts,
                limit: maxAttempts,
                remaining: attemptsRemaining,
                resetTime: record.expiresAt
            };

            // Check if limit exceeded
            if (record.attempts > maxAttempts) {
                const resetSeconds = Math.ceil((record.expiresAt - now) / 1000);
                return res.status(429).json({
                    message: "Too many attempts. Please try again later.",
                    retryAfter: resetSeconds
                });
            }

            // Set response headers
            res.set('X-RateLimit-Limit', maxAttempts.toString());
            res.set('X-RateLimit-Remaining', attemptsRemaining.toString());
            res.set('X-RateLimit-Reset', record.expiresAt.toString());

            next();
        } catch (error) {
            // On error, allow request but log it
            console.error('Rate limit middleware error:', error);
            next();
        }
    };
};

/**
 * Rate limit by IP address
 */
const rateLimitByIP = (endpoint = 'auth', maxAttempts = 5, windowMinutes = 15) => {
    return rateLimit({
        endpoint,
        maxAttempts,
        windowMinutes,
        keyFn: (req) => req.ip || req.connection.remoteAddress || 'unknown'
    });
};

/**
 * Rate limit by email (for login/password reset)
 */
const rateLimitByEmail = (endpoint = 'login', maxAttempts = 5, windowMinutes = 15) => {
    return rateLimit({
        endpoint,
        maxAttempts,
        windowMinutes,
        keyFn: (req) => req.body.email || 'unknown'
    });
};

/**
 * Rate limit by user ID (for logged-in actions)
 */
const rateLimitByUserId = (endpoint = 'sensitive', maxAttempts = 10, windowMinutes = 15) => {
    return (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return rateLimit({
            endpoint,
            maxAttempts,
            windowMinutes,
            keyFn: (req) => req.user.id || 'unknown'
        })(req, res, next);
    };
};

/**
 * Aggressive rate limiting (for sensitive operations)
 * Fewer attempts, shorter window
 */
const aggressiveRateLimit = (endpoint = 'critical', maxAttempts = 3, windowMinutes = 5) => {
    return rateLimit({
        endpoint,
        maxAttempts,
        windowMinutes,
        keyFn: (req) => (req.user?.id || req.ip || 'unknown')
    });
};

/**
 * Clear rate limit entries for a specific key
 * (useful for admin actions)
 */
const clearRateLimit = (key) => {
    attemptStore.delete(key);
};

/**
 * Get current rate limit status
 */
const getRateLimitStatus = (key) => {
    return attemptStore.get(key) || null;
};

module.exports = {
    rateLimit,
    rateLimitByIP,
    rateLimitByEmail,
    rateLimitByUserId,
    aggressiveRateLimit,
    clearRateLimit,
    getRateLimitStatus
};
