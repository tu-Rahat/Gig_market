const {
    encryptFields,
    decryptFields
} = require("./rsa.application");

/*
 * User fields that contain application/user information.
 *
 * Password is intentionally excluded because passwords
 * must be hashed and salted, not RSA encrypted.
 *
 * Email is also excluded for now because the existing
 * authentication flow uses email for database lookup.
 */
const USER_ENCRYPTED_FIELDS = [
    "name",
    "profileImage",
    "bio",
    "skills",
    "experience",
    "certifications"
];

/**
 * Encrypt protected user fields before persistence.
 *
 * @param {Object} userData
 * @param {Object} publicKey
 * @returns {Promise<Object>}
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
 * Decrypt protected user fields after retrieval.
 *
 * @param {Object} userData
 * @param {Object} privateKey
 * @returns {Promise<Object>}
 */
const decryptUserData = async (
    userData,
    privateKey
) => {
    return decryptFields(
        userData,
        USER_ENCRYPTED_FIELDS,
        privateKey
    );
};

module.exports = {
    USER_ENCRYPTED_FIELDS,
    encryptUserData,
    decryptUserData
};