const {
    encryptData,
    decryptData
} = require("./rsa.service");

/**
 * RSA Application Adapter
 *
 * This module keeps application/business logic separate
 * from the low-level RSA implementation.
 *
 * Member 2's Key Management module will provide the
 * appropriate RSA public/private keys.
 */

/**
 * Encrypt an application value using the supplied RSA public key.
 *
 * @param {*} value
 * @param {Object} publicKey
 * @returns {Promise<Object>}
 */
const encryptApplicationData = async (
    value,
    publicKey
) => {
    if (!publicKey) {
        throw new Error(
            "RSA public key is required"
        );
    }

    return encryptData(
        value,
        publicKey
    );
};

/**
 * Decrypt an application value using the supplied RSA private key.
 *
 * @param {Object} encryptedValue
 * @param {Object} privateKey
 * @returns {Promise<*>}
 */
const decryptApplicationData = async (
    encryptedValue,
    privateKey
) => {
    if (!privateKey) {
        throw new Error(
            "RSA private key is required"
        );
    }

    return decryptData(
        encryptedValue,
        privateKey
    );
};

/**
 * Encrypt multiple fields in an object.
 *
 * Only the fields explicitly provided in `fields`
 * are encrypted.
 *
 * @param {Object} data
 * @param {string[]} fields
 * @param {Object} publicKey
 * @returns {Promise<Object>}
 */
const encryptFields = async (
    data,
    fields,
    publicKey
) => {
    if (!data || typeof data !== "object") {
        throw new Error(
            "Data must be an object"
        );
    }

    if (!Array.isArray(fields)) {
        throw new Error(
            "Fields must be an array"
        );
    }

    const result = {
        ...data
    };

    for (const field of fields) {
        if (
            Object.prototype.hasOwnProperty.call(
                data,
                field
            ) &&
            data[field] !== undefined &&
            data[field] !== null
        ) {
            result[field] =
                await encryptApplicationData(
                    data[field],
                    publicKey
                );
        }
    }

    return result;
};

/**
 * Decrypt multiple encrypted fields in an object.
 *
 * @param {Object} data
 * @param {string[]} fields
 * @param {Object} privateKey
 * @returns {Promise<Object>}
 */
const decryptFields = async (
    data,
    fields,
    privateKey
) => {
    if (!data || typeof data !== "object") {
        throw new Error(
            "Data must be an object"
        );
    }

    if (!Array.isArray(fields)) {
        throw new Error(
            "Fields must be an array"
        );
    }

    const result = {
        ...data
    };

    for (const field of fields) {
        if (
            Object.prototype.hasOwnProperty.call(
                data,
                field
            ) &&
            data[field]
        ) {
            result[field] =
                await decryptApplicationData(
                    data[field],
                    privateKey
                );
        }
    }

    return result;
};

module.exports = {
    encryptApplicationData,
    decryptApplicationData,
    encryptFields,
    decryptFields
};