"use strict";

const { randomScalar } = require("./ecc.keys");
const { CURVE, scalarMultiply, pointAdd, pointSubtract, assertValidPoint, assertValidPublicKey } = require("./ecc.curve");

const encryptPoint = (messagePoint, publicKey) => {
    assertValidPoint(messagePoint);
    assertValidPublicKey(publicKey);
    const k = randomScalar();
    const C1 = scalarMultiply(k, CURVE.G);
    const shared = scalarMultiply(k, publicKey);
    return { C1, C2: pointAdd(messagePoint, shared) };
};

const decryptPoint = (ciphertext, privateKey) => {
    if (typeof privateKey !== "bigint" || privateKey <= 0n || privateKey >= CURVE.n) {
        throw new Error("Invalid private key");
    }
    if (!ciphertext || !ciphertext.C1 || !ciphertext.C2) throw new Error("Invalid ciphertext");
    assertValidPoint(ciphertext.C1);
    assertValidPoint(ciphertext.C2);
    return pointSubtract(ciphertext.C2, scalarMultiply(privateKey, ciphertext.C1));
};

module.exports = { encryptPoint, decryptPoint };
