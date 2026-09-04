"use strict";

/**
 * Two-Factor Authentication (2FA) Middleware
 * 
 * Enforces 2FA verification before granting privileged access.
 * 
 * Protects:
 * - Account settings changes
 * - Password changes
 * - Permission elevation
 * - Sensitive data access
 */

/**
 * Require successful 2FA verification
 * 
 * Checks if the user has completed 2FA verification
 * in the current session.
 * 
 * @returns {Function} - Express middleware
 */
const require2FA = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized: Authentication required"
        });
    }

    if (!req.user.twoFactorVerified) {
        return res.status(403).json({
            message: "Forbidden: Two-factor authentication required"
        });
    }

    next();
};

/**
 * Check if 2FA is enabled for user
 * 
 * @returns {Function} - Express middleware
 */
const check2FAStatus = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized: Authentication required"
        });
    }

    req.user.has2FAEnabled = req.user.twoFactorSecret ? true : false;
    
    next();
};

/**
 * Middleware to attach 2FA verification flag to session
 * 
 * Called after successful OTP verification
 * 
 * @returns {Function} - Express middleware
 */
const set2FAVerified = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized: Authentication required"
        });
    }

    req.user.twoFactorVerified = true;
    req.user.twoFactorVerifiedAt = Date.now();

    next();
};

/**
 * Rate limit 2FA OTP verification attempts
 * 
 * Prevents brute force attacks on OTP
 * 
 * @param {number} maxAttempts - Maximum OTP attempts (default: 5)
 * @param {number} windowMinutes - Time window in minutes (default: 15)
 * @returns {Function} - Express middleware
 */
const rate2FAAttempts = (
    maxAttempts = 5,
    windowMinutes = 15
) => {
    // In-memory attempt tracking (use Redis in production)
    const attemptMap = new Map();

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id || req.user._id;
        const key = `2fa-attempts-${userId}`;
        const now = Date.now();
        const windowMs = windowMinutes * 60 * 1000;

        let record = attemptMap.get(key);

        if (!record) {
            record = {
                attempts: 0,
                firstAttempt: now
            };
            attemptMap.set(key, record);
        }

        // Reset if outside window
        if (now - record.firstAttempt > windowMs) {
            record.attempts = 0;
            record.firstAttempt = now;
        }

        record.attempts++;

        if (record.attempts > maxAttempts) {
            return res.status(429).json({
                message: "Too many 2FA verification attempts. Please try again later."
            });
        }

        req.attemptsRemaining = maxAttempts - record.attempts;

        next();
    };
};

/**
 * Clear 2FA verification after timeout
 * 
 * @param {number} timeoutMinutes - Timeout in minutes (default: 30)
 * @returns {Function} - Express middleware
 */
const clear2FAOnTimeout = (timeoutMinutes = 30) => {
    return (req, res, next) => {
        if (!req.user) {
            return next();
        }

        if (req.user.twoFactorVerified) {
            const verifiedAt = req.user.twoFactorVerifiedAt || Date.now();
            const timeoutMs = timeoutMinutes * 60 * 1000;

            if (Date.now() - verifiedAt > timeoutMs) {
                req.user.twoFactorVerified = false;
                delete req.user.twoFactorVerifiedAt;
            }
        }

        next();
    };
};

module.exports = {
    require2FA,
    check2FAStatus,
    set2FAVerified,
    rate2FAAttempts,
    clear2FAOnTimeout
};
