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
/**
 * Maximum plaintext size for one
 * RSA PKCS#1 v1.5 encryption block.
 *
 * PKCS#1 requires:
 *
 * k - 11
 *
 * bytes of plaintext at most.
 */
function getMaxBlockSize(publicKey) {
    const modulusByteLength =
        getModulusByteLength(
            publicKey
        );

    return modulusByteLength - 11;
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
 * Get the RSA modulus size in bytes.
 */
function getModulusByteLength(publicKey) {
    const n = BigInt(publicKey.n);

    return Math.ceil(
        n.toString(2).length / 8
    );
}

/**
 * PKCS#1 v1.5 encryption padding.
 *
 * Encoded message:
 *
 * 00 || 02 || PS || 00 || M
 *
 * PS consists of randomly generated non-zero bytes.
 *
 * Minimum PS length is 8 bytes.
 */
function applyPKCS1Padding(
    message,
    modulusByteLength
) {
    const minimumPaddingLength = 8;

    const paddingLength =
        modulusByteLength -
        message.length -
        3;

    if (
        paddingLength <
        minimumPaddingLength
    ) {
        throw new Error(
            "Message is too large for the RSA block"
        );
    }

    const padding = Buffer.alloc(
        paddingLength
    );

    let offset = 0;

    while (
        offset < padding.length
    ) {
        const randomBytes =
            crypto.randomBytes(
                padding.length - offset
            );

        for (
            const byte of randomBytes
        ) {
            if (byte !== 0) {
                padding[offset] = byte;
                offset++;

                if (
                    offset ===
                    padding.length
                ) {
                    break;
                }
            }
        }
    }

    return Buffer.concat([
        Buffer.from([0x00, 0x02]),
        padding,
        Buffer.from([0x00]),
        message
    ]);
}

/**
 * Remove PKCS#1 v1.5 encryption padding.
 */
function removePKCS1Padding(
    encodedMessage
) {
    if (
        encodedMessage.length < 11
    ) {
        throw new Error(
            "Invalid RSA padded block"
        );
    }

    if (
        encodedMessage[0] !== 0x00 ||
        encodedMessage[1] !== 0x02
    ) {
        throw new Error(
            "Invalid RSA padding"
        );
    }

    let separatorIndex = -1;

    for (
        let i = 2;
        i < encodedMessage.length;
        i++
    ) {
        if (
            encodedMessage[i] === 0x00
        ) {
            separatorIndex = i;
            break;
        }
    }

    if (separatorIndex === -1) {
        throw new Error(
            "Invalid RSA padding separator"
        );
    }

    const paddingLength =
        separatorIndex - 2;

    if (
        paddingLength < 8
    ) {
        throw new Error(
            "Invalid RSA padding length"
        );
    }

    return encodedMessage.subarray(
        separatorIndex + 1
    );
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
/**
 * Encrypt application data using RSA
 * with PKCS#1 v1.5 encryption padding.
 */
async function encryptData(
    data,
    publicKey
) {
    const plaintext =
        serializeData(data);

    const modulusByteLength =
        getModulusByteLength(
            publicKey
        );

    const blockSize =
        getMaxBlockSize(
            publicKey
        );

    if (blockSize <= 0) {
        throw new Error(
            "RSA modulus is too small"
        );
    }

    const plaintextBlocks =
        splitIntoBlocks(
            plaintext,
            blockSize
        );

    const encryptedBlocks =
        plaintextBlocks.map(
            (block) => {
                const paddedBlock =
                    applyPKCS1Padding(
                        block,
                        modulusByteLength
                    );

                const message =
                    bufferToBigInt(
                        paddedBlock
                    );

                const ciphertext =
                    encryptInteger(
                        message,
                        publicKey
                    );

                return ciphertext
                    .toString(16)
                    .padStart(
                        modulusByteLength * 2,
                        "0"
                    );
            }
        );

    return {
        algorithm: "Custom RSA",
        padding: "PKCS#1 v1.5",
        encoding: "hex",
        modulusByteLength,
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
/**
 * Decrypt RSA blocks and remove
 * PKCS#1 v1.5 padding.
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

    const modulusByteLength =
        encryptedData.modulusByteLength ||
        Math.ceil(
            BigInt(privateKey.n)
                .toString(2)
                .length / 8
        );

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

                const paddedNumber =
                    decryptInteger(
                        ciphertext,
                        privateKey
                    );

                let paddedBlock =
                    bigIntToBuffer(
                        paddedNumber
                    );

                /*
                 * RSA decryption may produce a Buffer
                 * shorter than the modulus length.
                 *
                 * Restore leading zero bytes.
                 */
                if (
                    paddedBlock.length <
                    modulusByteLength
                ) {
                    const fullBlock =
                        Buffer.alloc(
                            modulusByteLength
                        );

                    paddedBlock.copy(
                        fullBlock,
                        modulusByteLength -
                            paddedBlock.length
                    );

                    paddedBlock =
                        fullBlock;
                }

                return removePKCS1Padding(
                    paddedBlock
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
    splitIntoBlocks,
    getModulusByteLength,
    applyPKCS1Padding,
    removePKCS1Padding
};