"use strict";

const { getECCPublicKey, getECCPrivateKey } = require("./ecc.keyProvider");
const { deriveSharedSecret } = require("./ecc.ecdh");
const { sign, verify } = require("./ecc.ecdsa");
const { encryptPoint, decryptPoint } = require("./ecc.elgamal");
const { CURVE, isOnCurve } = require("./ecc.curve");
const { serializePoint, deserializePoint, serializeSignature, deserializeSignature } = require("./ecc.serialization");

const MAX_MESSAGE_BYTES = 29;
const MAPPING_BASE = 256n;
const CHUNKED_VERSION = 2;

const modularSquareRoot = (value) => {
    const root = require("./ecc.math").fieldPow(value, (CURVE.p + 1n) / 4n, CURVE.p);
    return require("./ecc.math").mod(root * root, CURVE.p) === value ? root : null;
};

const encodeTextPoint = (message) => {
    const bytes = Buffer.from(String(message), "utf8");
    if (bytes.length > MAX_MESSAGE_BYTES) throw new Error(`Message exceeds ${MAX_MESSAGE_BYTES}-byte EC-ElGamal limit`);
    const value = bytes.length === 0 ? 0n : BigInt(`0x${bytes.toString("hex")}`);
    for (let counter = 0n; counter < MAPPING_BASE; counter += 1n) {
        const x = value * MAPPING_BASE + counter;
        if (x >= CURVE.p) break;
        const right = (x * x * x + CURVE.a * x + CURVE.b) % CURVE.p;
        const y = modularSquareRoot(right);
        if (y !== null) return { point: { x, y }, length: bytes.length };
    }
    throw new Error("Unable to map message to a curve point");
};

const decodeTextPoint = (point, length) => {
    if (!isOnCurve(point) || !Number.isInteger(length) || length < 0 || length > MAX_MESSAGE_BYTES) throw new Error("Invalid encoded message point");
    if (length === 0) return "";
    const value = point.x / MAPPING_BASE;
    const hex = value.toString(16).padStart(length * 2, "0");
    return Buffer.from(hex, "hex").subarray(-length).toString("utf8");
};

const splitUtf8 = (message) => {
    const chunks = [];
    let current = "";
    let currentLength = 0;

    for (const character of String(message)) {
        const characterLength = Buffer.byteLength(character, "utf8");
        if (current && currentLength + characterLength > MAX_MESSAGE_BYTES) {
            chunks.push(current);
            current = "";
            currentLength = 0;
        }
        current += character;
        currentLength += characterLength;
    }

    if (current || chunks.length === 0) chunks.push(current);
    return chunks;
};

const encryptText = async (message, keyId) => {
    const publicKey = await getECCPublicKey(keyId);
    const chunks = [];

    for (const chunk of splitUtf8(message)) {
        const encoded = encodeTextPoint(chunk);
        const ciphertext = encryptPoint(encoded.point, publicKey);
        chunks.push({
            length: encoded.length,
            C1: serializePoint(ciphertext.C1),
            C2: serializePoint(ciphertext.C2)
        });
    }

    return {
        algorithm: "Custom ECC ElGamal",
        curve: CURVE.name,
        keyId,
        version: CHUNKED_VERSION,
        encoding: "utf8-point-v1",
        ciphertext: { chunks }
    };
};

const decryptText = async (encryptedValue, keyId) => {
    if (!encryptedValue || encryptedValue.keyId !== keyId || encryptedValue.version !== CHUNKED_VERSION) throw new Error("Unsupported ECC ciphertext metadata");
    const privateKey = await getECCPrivateKey(keyId);
    if (!Array.isArray(encryptedValue.ciphertext?.chunks)) throw new Error("Invalid ECC ciphertext chunks");
    return encryptedValue.ciphertext.chunks.map((chunk) => {
        const point = decryptPoint({ C1: deserializePoint(chunk.C1), C2: deserializePoint(chunk.C2) }, privateKey);
        return decodeTextPoint(point, chunk.length);
    }).join("");
};

const signWithManagedKey = async (message, keyId) => sign(message, await getECCPrivateKey(keyId));
const verifyWithManagedKey = async (message, signature, keyId) => verify(message, signature, await getECCPublicKey(keyId));
const signSerialized = async (message, keyId) => serializeSignature(await signWithManagedKey(message, keyId));
const verifySerialized = async (message, signature, keyId) => verifyWithManagedKey(message, deserializeSignature(signature), keyId);

module.exports = {
    MAX_MESSAGE_BYTES,
    encodeTextPoint,
    decodeTextPoint,
    encryptText,
    decryptText,
    signWithManagedKey,
    verifyWithManagedKey,
    signSerialized,
    verifySerialized,
    deriveSharedSecret
};
