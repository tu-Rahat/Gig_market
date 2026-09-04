"use strict";

const { randomBytes } = require("crypto");
const { CURVE, scalarMultiply, assertValidPoint } = require("./ecc.curve");

const bytesToBigInt = (buffer) => {
    if (buffer.length === 0) return 0n;
    return BigInt(`0x${buffer.toString("hex")}`);
};

const randomScalar = () => {
    while (true) {
        const value = bytesToBigInt(randomBytes(32)) % CURVE.n;
        if (value > 0n) return value;
    }
};

const generateKeyPair = () => {
    const privateKey = randomScalar();
    const publicKey = scalarMultiply(privateKey, CURVE.G);
    assertValidPoint(publicKey);
    return { privateKey, publicKey };
};

module.exports = { bytesToBigInt, randomScalar, generateKeyPair };
