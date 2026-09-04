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
 * Get the maximum plaintext block size in bytes.
 *
 * RSA can only encrypt a message smaller than the modulus.
 * We reserve one byte so the resulting integer is always
 * safely smaller than n.
 */
function getMaxBlockSize(publicKey) {
    const n = BigInt(publicKey.n);

    const modulusBits =
        n.toString(2).length;

    const modulusBytes =
        Math.floor(modulusBits / 8);

    return modulusBytes - 1;
}

/**
 * Split a Buffer into RSA-compatible blocks.
 */
function splitIntoBlocks(
    buffer,
    blockSize
) {
    const blocks = [];

    for (
        let offset = 0;
        offset < buffer.length;
        offset += blockSize
    ) {
        blocks.push(
            buffer.subarray(
                offset,
                offset + blockSize
            )
        );
    }

    return blocks;
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
/**
 * Encrypt application data using RSA blocks.
 *
 * Large data is divided into multiple blocks because
 * a single RSA operation cannot encrypt unlimited data.
 */
async function encryptData(
    data,
    publicKey
) {
    const plaintext =
        serializeData(data);

    const blockSize =
        getMaxBlockSize(publicKey);

    if (blockSize <= 0) {
        throw new Error(
            "Invalid RSA modulus"
        );
    }

    const blocks =
        splitIntoBlocks(
            plaintext,
            blockSize
        );

    const encryptedBlocks =
        blocks.map((block) => {
            const message =
                bufferToBigInt(block);

            const ciphertext =
                encryptInteger(
                    message,
                    publicKey
                );

            return ciphertext.toString(16);
        });

    return {
        algorithm: "Custom RSA",
        encoding: "hex",
        blockSize,
        blocks: encryptedBlocks,
        originalType:
            typeof data
    };
}

/**
 * Decrypt application data using RSA.
 */
/**
 * Decrypt RSA encrypted blocks.
 */
async function decryptData(
    encryptedData,
    privateKey
) {
    if (
        !encryptedData ||
        !Array.isArray(
            encryptedData.blocks
        )
    ) {
        throw new Error(
            "Invalid encrypted data"
        );
    }

    const decryptedBlocks =
        encryptedData.blocks.map(
            (ciphertextHex) => {
                if (
                    typeof ciphertextHex !==
                    "string" ||
                    ciphertextHex.length === 0
                ) {
                    throw new Error(
                        "Invalid RSA ciphertext block"
                    );
                }

                const ciphertext =
                    BigInt(
                        "0x" +
                        ciphertextHex
                    );

                const plaintextNumber =
                    decryptInteger(
                        ciphertext,
                        privateKey
                    );

                return bigIntToBuffer(
                    plaintextNumber
                );
            }
        );

    const plaintext =
        Buffer.concat(
            decryptedBlocks
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
    bigIntToBuffer,
    getMaxBlockSize,
    splitIntoBlocks
};