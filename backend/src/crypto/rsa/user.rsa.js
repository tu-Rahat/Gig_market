const {
    encryptFields,
    decryptFields
} = require("./rsa.application");

const USER_ENCRYPTED_FIELDS = [
    "name",
    "profileImage",
    "bio",
    "skills",
    "experience",
    "certifications"
];

/**
 * Determines whether a value is one of our
 * RSA encrypted envelopes.
 */
const isEncryptedValue = (value) => {
    return Boolean(
        value &&
        typeof value === "object" &&
        value.algorithm === "Custom RSA" &&
        Array.isArray(value.blocks)
    );
};

/**
 * Encrypt protected user fields.
 */
const encryptUserData = async (
    userData,
    publicKey
) => {
    return encryptFields(
        userData,
        USER_ENCRYPTED_FIELDS,
        publicKey
    );
};

/**
 * Decrypt protected user fields.
 *
 * Existing plaintext values are preserved so that
 * old database records do not immediately break.
 */
const decryptUserData = async (
    userData,
    privateKey
) => {
    if (
        !userData ||
        typeof userData !== "object"
    ) {
        return userData;
    }

    const encryptedFields =
        USER_ENCRYPTED_FIELDS.filter(
            (field) =>
                isEncryptedValue(
                    userData[field]
                )
        );

    if (
        encryptedFields.length === 0
    ) {
        return {
            ...userData
        };
    }

    return decryptFields(
        userData,
        encryptedFields,
        privateKey
    );
};

module.exports = {
    USER_ENCRYPTED_FIELDS,
    isEncryptedValue,
    encryptUserData,
    decryptUserData
};