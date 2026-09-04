"use strict";

const {
    createHmac,
    verifyHmac
} = require("./hmac.service");

const {
    canonicalize
} = require("./canonicalize");

/**
 * Create an integrity tag for a payload
 * 
 * @param {*} payload - The payload to protect
 * @param {string} secret - The HMAC secret (typically CRYPTO_HMAC_SECRET)
 * @returns {string} - Hex-encoded integrity tag
 */
const createIntegrityTag = (
    payload,
    secret
) => {
    if (!secret) {
        throw new Error("HMAC secret is required");
    }

    return createHmac(
        canonicalize(payload),
        secret
    );
};

/**
 * Verify an integrity tag for a payload
 * 
 * @param {*} payload - The payload to verify
 * @param {string} tag - The expected integrity tag
 * @param {string} secret - The HMAC secret
 * @returns {boolean} - Whether the tag is valid
 */
const verifyIntegrityTag = (
    payload,
    tag,
    secret
) => {
    if (!secret) {
        throw new Error("HMAC secret is required");
    }

    if (!tag) {
        return false;
    }

    return verifyHmac(
        canonicalize(payload),
        tag,
        secret
    );
};

module.exports = {
    createIntegrityTag,
    verifyIntegrityTag
};
