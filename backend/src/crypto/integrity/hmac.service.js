"use strict";

const crypto = require("crypto");

/**
 * Create HMAC using SHA256
 * 
 * @param {string} value - The value to hash
 * @param {string} secret - The HMAC secret key
 * @returns {string} - Hex-encoded HMAC
 */
const createHmac = (value, secret) => {
    return crypto
        .createHmac("sha256", secret)
        .update(value, "utf8")
        .digest("hex");
};

/**
 * Verify HMAC using timing-safe comparison
 * 
 * @param {string} value - The value to verify
 * @param {string} expected - The expected HMAC value
 * @param {string} secret - The HMAC secret key
 * @returns {boolean} - Whether the HMAC is valid
 */
const verifyHmac = (value, expected, secret) => {
    const actual = createHmac(value, secret);

    const a = Buffer.from(actual, "hex");
    const b = Buffer.from(expected, "hex");

    if (a.length !== b.length) {
        return false;
    }

    return crypto.timingSafeEqual(a, b);
};

module.exports = {
    createHmac,
    verifyHmac
};
