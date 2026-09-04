"use strict";

const {
    createIntegrityTag,
    verifyIntegrityTag
} = require("./integrity/integrity.service");

const {
    getPolicyForCategory,
    getFieldsToEncrypt,
    getAlgorithmForCategory,
    getKeyIdForCategory
} = require("./crypto.policy");

const {
    encryptApplicationData,
    decryptApplicationData
} = require("./rsa/rsa.application");

const {
    encryptText,
    decryptText
} = require("./ecc/ecc.application");

/**
 * Protect a record by encrypting sensitive fields
 * 
 * @param {Object} record - The database record to protect
 * @param {string} category - Data category from crypto policy
 * @param {string} hmacSecret - HMAC secret for integrity protection
 * @returns {Promise<Object>} - Protected record with encrypted fields and integrity tag
 */
const protectRecord = async (
    record,
    category,
    hmacSecret
) => {
    if (!record || typeof record !== "object") {
        throw new Error("Record must be a valid object");
    }

    if (!hmacSecret) {
        throw new Error("HMAC secret is required");
    }

    try {
        const policy = getPolicyForCategory(category);
        const fieldsToEncrypt = getFieldsToEncrypt(category);
        const algorithm = getAlgorithmForCategory(category);
        const keyId = getKeyIdForCategory(category);

        // Encrypt specified fields
        const protectedRecord = { ...record };
        const fieldsEncrypted = {};

        for (const field of fieldsToEncrypt) {
            if (field in protectedRecord && protectedRecord[field] !== null && protectedRecord[field] !== undefined) {
                let encryptedValue;

                if (algorithm === "Custom RSA") {
                    encryptedValue = await encryptApplicationData(
                        protectedRecord[field],
                        null // Key provider will be used
                    );
                } else if (algorithm === "Custom ECC") {
                    encryptedValue = await encryptText(
                        JSON.stringify(protectedRecord[field]),
                        keyId
                    );
                }

                fieldsEncrypted[field] = encryptedValue;
                protectedRecord[field] = encryptedValue;
            }
        }

        // Create integrity tag over the protected record
        const integrityTag = createIntegrityTag(
            protectedRecord,
            hmacSecret
        );

        // Attach protection metadata
        protectedRecord.__protected = {
            category,
            algorithm,
            keyId,
            fieldsEncrypted: Object.keys(fieldsEncrypted),
            integrity: {
                algorithm: "HMAC-SHA256",
                tag: integrityTag,
                keyId: "application-integrity-v1"
            },
            protectedAt: new Date()
        };

        return protectedRecord;
    } catch (error) {
        throw new Error(`Failed to protect record: ${error.message}`);
    }
};

/**
 * Unprotect a record by verifying integrity and decrypting sensitive fields
 * 
 * @param {Object} record - The protected database record
 * @param {string} category - Data category from crypto policy
 * @param {string} hmacSecret - HMAC secret for integrity verification
 * @returns {Promise<Object>} - Unprotected record with decrypted sensitive fields
 */
const unprotectRecord = async (
    record,
    category,
    hmacSecret
) => {
    if (!record || typeof record !== "object") {
        throw new Error("Record must be a valid object");
    }

    if (!hmacSecret) {
        throw new Error("HMAC secret is required");
    }

    try {
        const policy = getPolicyForCategory(category);
        const fieldsToEncrypt = getFieldsToEncrypt(category);
        const algorithm = getAlgorithmForCategory(category);
        const keyId = getKeyIdForCategory(category);

        // Verify integrity before decryption
        if (record.__protected && record.__protected.integrity) {
            const payload = { ...record };
            delete payload.__protected;

            const isValid = verifyIntegrityTag(
                payload,
                record.__protected.integrity.tag,
                hmacSecret
            );

            if (!isValid) {
                throw new Error("Record integrity verification failed - data may be tampered");
            }
        }

        // Decrypt fields
        const unprotectedRecord = { ...record };

        for (const field of fieldsToEncrypt) {
            if (field in unprotectedRecord && unprotectedRecord[field] !== null) {
                const encryptedValue = unprotectedRecord[field];

                if (!encryptedValue.algorithm) {
                    // Field was not encrypted (null/undefined in original)
                    continue;
                }

                let decryptedValue;

                if (encryptedValue.algorithm === "Custom RSA") {
                    decryptedValue = await decryptApplicationData(
                        encryptedValue,
                        null // Key provider will be used
                    );
                } else if (encryptedValue.algorithm === "Custom ECC ElGamal") {
                    const jsonStr = await decryptText(encryptedValue, keyId);
                    decryptedValue = JSON.parse(jsonStr);
                }

                unprotectedRecord[field] = decryptedValue;
            }
        }

        // Remove protection metadata from returned record
        delete unprotectedRecord.__protected;

        return unprotectedRecord;
    } catch (error) {
        throw new Error(`Failed to unprotect record: ${error.message}`);
    }
};

/**
 * Check if a record is protected
 * 
 * @param {Object} record - The record to check
 * @returns {boolean} - Whether the record has protection metadata
 */
const isRecordProtected = (record) => {
    return record && 
           typeof record === "object" && 
           record.__protected && 
           typeof record.__protected === "object";
};

/**
 * Protect multiple records
 * 
 * @param {Array} records - Array of records to protect
 * @param {string} category - Data category
 * @param {string} hmacSecret - HMAC secret
 * @returns {Promise<Array>} - Array of protected records
 */
const protectRecords = async (
    records,
    category,
    hmacSecret
) => {
    if (!Array.isArray(records)) {
        throw new Error("Records must be an array");
    }

    return Promise.all(
        records.map(record =>
            protectRecord(record, category, hmacSecret)
        )
    );
};

/**
 * Unprotect multiple records
 * 
 * @param {Array} records - Array of protected records
 * @param {string} category - Data category
 * @param {string} hmacSecret - HMAC secret
 * @returns {Promise<Array>} - Array of unprotected records
 */
const unprotectRecords = async (
    records,
    category,
    hmacSecret
) => {
    if (!Array.isArray(records)) {
        throw new Error("Records must be an array");
    }

    return Promise.all(
        records.map(record =>
            unprotectRecord(record, category, hmacSecret)
        )
    );
};

module.exports = {
    protectRecord,
    unprotectRecord,
    isRecordProtected,
    protectRecords,
    unprotectRecords
};
