"use strict";

const { createHash } = require("crypto");
const { CURVE, pointAdd, scalarMultiply, assertValidPublicKey } = require("./ecc.curve");
const { mod, modInverse } = require("./ecc.math");
const { randomScalar } = require("./ecc.keys");

const hashMessage = (message) => {
    const digest = createHash("sha256").update(String(message), "utf8").digest("hex");
    return BigInt(`0x${digest}`) % CURVE.n;
};

const sign = (message, privateKey) => {
    if (typeof privateKey !== "bigint" || privateKey <= 0n || privateKey >= CURVE.n) {
        throw new Error("Invalid private key");
    }

    const z = hashMessage(message);
    while (true) {
        const k = randomScalar();
        const R = scalarMultiply(k, CURVE.G);
        const r = mod(R.x, CURVE.n);
        if (r === 0n) continue;
        const s = mod(modInverse(k, CURVE.n) * (z + r * privateKey), CURVE.n);
        if (s !== 0n) return { r, s };
    }
};

const verify = (message, signature, publicKey) => {
    try {
        assertValidPublicKey(publicKey);
        if (!signature || typeof signature.r !== "bigint" || typeof signature.s !== "bigint") return false;
        const { r, s } = signature;
        if (r <= 0n || r >= CURVE.n || s <= 0n || s >= CURVE.n) return false;

        const w = modInverse(s, CURVE.n);
        const u1 = mod(hashMessage(message) * w, CURVE.n);
        const u2 = mod(r * w, CURVE.n);
        const R = pointAdd(scalarMultiply(u1, CURVE.G), scalarMultiply(u2, publicKey));
        return Boolean(R) && mod(R.x, CURVE.n) === r;
    } catch {
        return false;
    }
};

module.exports = { hashMessage, sign, verify };
