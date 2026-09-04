const {
    generateKeyPair,
    encryptInteger,
    decryptInteger
} = require("./rsa");

const crypto = require("crypto");

/**
 * Convert a JavaScript value into a UTF-8 Buffer.
 *
 * Objects and arrays are serialized as JSON.
 */
function serializeData(data) {
    if (typeof data === "string") {
        return Buffer.from(data, "utf8");
    }

    return Buffer.from(
        JSON.stringify(data),
        "utf8"
    );
}

/**
 * Convert decrypted UTF-8 data back into its
 * original JavaScript representation when possible.
 */
function deserializeData(buffer) {
    const text = buffer.toString("utf8");

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Convert a Buffer into a BigInt.
 */
function bufferToBigInt(buffer) {
    if (buffer.length === 0) {
        return 0n;
    }

    return BigInt(
        "0x" + buffer.toString("hex")
    );
}

/**
 * Convert a BigInt into a Buffer.
 */
function bigIntToBuffer(value) {
    value = BigInt(value);

    if (value === 0n) {
        return Buffer.from([0]);
    }

    let hex = value.toString(16);

    if (hex.length % 2 !== 0) {
        hex = "0" + hex;
    }

    return Buffer.from(hex, "hex");
}

/**
 * Generate an RSA key pair.
 */
async function generateRSAKeyPair(
    keySize = 2048
) {
    return generateKeyPair(keySize);
}

/**
 * Encrypt application data using RSA.
 *
 * NOTE:
 * This function currently supports data that fits
 * into the RSA modulus. Block handling will be added
 * in the next implementation stage.
 */
async function encryptData(
    data,
    publicKey
) {
    const plaintext =
        serializeData(data);

    const message =
        bufferToBigInt(plaintext);

    const n = BigInt(publicKey.n);

    if (message >= n) {
        throw new Error(
            "Data is too large for the current RSA block. Use block encryption."
        );
    }

    const ciphertext =
        encryptInteger(
            message,
            publicKey
        );

    return {
        algorithm: "Custom RSA",
        encoding: "hex",
        ciphertext:
            ciphertext.toString(16),
        originalType:
            typeof data
    };
}

/**
 * Decrypt application data using RSA.
 */
async function decryptData(
    encryptedData,
    privateKey
) {
    if (
        !encryptedData ||
        encryptedData.ciphertext === undefined
    ) {
        throw new Error(
            "Invalid encrypted data"
        );
    }

    const ciphertext =
        BigInt(
            "0x" +
            encryptedData.ciphertext
        );

    const plaintextNumber =
        decryptInteger(
            ciphertext,
            privateKey
        );

    const plaintext =
        bigIntToBuffer(
            plaintextNumber
        );

    return deserializeData(
        plaintext
    );
}

module.exports = {
    generateRSAKeyPair,
    encryptData,
    decryptData,
    serializeData,
    deserializeData,
    bufferToBigInt,
    bigIntToBuffer
};