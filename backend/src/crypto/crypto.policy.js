"use strict";

/**
 * Central Crypto Policy
 * 
 * This module defines which cryptographic algorithms
 * are used for different data categories. The server
 * decides the policy; the client cannot override it.
 */

const CRYPTO_POLICY = {
    // User sensitive data
    user: {
        algorithm: "Custom RSA",
        fields: ["name", "email", "bio", "profileImage"],
        keyId: "dev-rsa-key"
    },

    // Worker/provider profile data
    workerProfile: {
        algorithm: "Custom RSA",
        fields: [
            "bio",
            "skills",
            "experience",
            "certifications",
            "portfolio",
            "availability"
        ],
        keyId: "dev-rsa-key"
    },

    // Credentials and security-sensitive data
    credential: {
        algorithm: "Custom ECC",
        fields: ["credentialData", "verification"],
        keyId: "dev-ecc-key"
    },

    // Transaction data
    transaction: {
        algorithm: "Custom RSA",
        fields: [
            "description",
            "details",
            "paymentReference"
        ],
        keyId: "dev-rsa-key"
    },

    // Review and feedback
    review: {
        algorithm: "Custom RSA",
        fields: ["comment", "feedback"],
        keyId: "dev-rsa-key"
    },

    // Dispute information
    dispute: {
        algorithm: "Custom RSA",
        fields: [
            "description",
            "evidence",
            "resolution"
        ],
        keyId: "dev-rsa-key"
    },

    // Task descriptions (can contain sensitive info)
    task: {
        algorithm: "Custom RSA",
        fields: [
            "description",
            "requirements",
            "details"
        ],
        keyId: "dev-rsa-key"
    },

    // Escrow information
    escrow: {
        algorithm: "Custom RSA",
        fields: ["notes", "details"],
        keyId: "dev-rsa-key"
    },

    // Bid information
    bid: {
        algorithm: "Custom RSA",
        fields: ["proposal", "notes"],
        keyId: "dev-rsa-key"
    },

    // Integrity protection
    integrity: {
        algorithm: "HMAC-SHA256",
        keyId: "application-integrity-v1"
    }
};

/**
 * Get crypto policy for a data category
 * 
 * @param {string} category - The data category
 * @returns {Object} - The crypto policy for that category
 */
const getPolicyForCategory = (category) => {
    const policy = CRYPTO_POLICY[category];

    if (!policy) {
        throw new Error(
            `Unknown data category: ${category}`
        );
    }

    return policy;
};

/**
 * Get fields to encrypt for a category
 * 
 * @param {string} category - The data category
 * @returns {string[]} - List of field names to encrypt
 */
const getFieldsToEncrypt = (category) => {
    const policy = getPolicyForCategory(category);
    return policy.fields || [];
};

/**
 * Get algorithm for a category
 * 
 * @param {string} category - The data category
 * @returns {string} - Algorithm name
 */
const getAlgorithmForCategory = (category) => {
    const policy = getPolicyForCategory(category);
    return policy.algorithm;
};

/**
 * Get key ID for a category
 * 
 * @param {string} category - The data category
 * @returns {string} - Key ID
 */
const getKeyIdForCategory = (category) => {
    const policy = getPolicyForCategory(category);
    return policy.keyId;
};

/**
 * Validate that a field can be encrypted for a category
 * 
 * @param {string} category - The data category
 * @param {string} field - The field name
 * @returns {boolean} - Whether the field should be encrypted
 */
const shouldEncryptField = (category, field) => {
    const fields = getFieldsToEncrypt(category);
    return fields.includes(field);
};

module.exports = {
    CRYPTO_POLICY,
    getPolicyForCategory,
    getFieldsToEncrypt,
    getAlgorithmForCategory,
    getKeyIdForCategory,
    shouldEncryptField
};
