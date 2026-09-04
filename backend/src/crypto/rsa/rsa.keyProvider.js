/**
 * RSA Key Provider
 *
 * This module defines the interface used by the RSA
 * application layer to obtain cryptographic keys.
 *
 * IMPORTANT:
 * This is intentionally an adapter/interface layer.
 *
 * The permanent key generation, storage, rotation and
 * revocation system will be supplied by the Key Management
 * module.
 *
 * Member 1 must NOT create a second key-management system.
 */

let keyProvider = null;

/**
 * Register the application's RSA key provider.
 *
 * The provider must implement:
 *
 * getPublicKey(keyId)
 * getPrivateKey(keyId)
 *
 * @param {Object} provider
 */
const configureRSAKeyProvider = (
    provider
) => {
    if (
        !provider ||
        typeof provider.getPublicKey !== "function" ||
        typeof provider.getPrivateKey !== "function"
    ) {
        throw new Error(
            "Invalid RSA key provider"
        );
    }

    keyProvider = provider;
};

/**
 * Get RSA public key.
 *
 * @param {string} keyId
 * @returns {Promise<Object>}
 */
const getRSAPublicKey = async (
    keyId
) => {
    if (!keyProvider) {
        throw new Error(
            "RSA key provider has not been configured"
        );
    }

    if (!keyId) {
        throw new Error(
            "RSA key ID is required"
        );
    }

    const key =
        await keyProvider.getPublicKey(
            keyId
        );

    if (!key) {
        throw new Error(
            `RSA public key not found: ${keyId}`
        );
    }

    return key;
};

/**
 * Get RSA private key.
 *
 * @param {string} keyId
 * @returns {Promise<Object>}
 */
const getRSAPrivateKey = async (
    keyId
) => {
    if (!keyProvider) {
        throw new Error(
            "RSA key provider has not been configured"
        );
    }

    if (!keyId) {
        throw new Error(
            "RSA key ID is required"
        );
    }

    const key =
        await keyProvider.getPrivateKey(
            keyId
        );

    if (!key) {
        throw new Error(
            `RSA private key not found: ${keyId}`
        );
    }

    return key;
};

const configureDevelopmentRSAProvider = () => {
    const devProvider = require(
        "./dev.rsaProvider"
    );

    configureRSAKeyProvider(
        devProvider
    );

    return devProvider.getDevRSAKeyId();
};

module.exports = {
    configureRSAKeyProvider,
    configureDevelopmentRSAProvider,
    getRSAPublicKey,
    getRSAPrivateKey
};