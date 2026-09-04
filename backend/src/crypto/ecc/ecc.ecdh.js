"use strict";

const { CURVE, scalarMultiply, assertValidPublicKey } = require("./ecc.curve");

const deriveSharedSecret = (privateKey, peerPublicKey) => {
    if (typeof privateKey !== "bigint" || privateKey <= 0n || privateKey >= CURVE.n) {
        throw new Error("Invalid private key");
    }
    assertValidPublicKey(peerPublicKey);

    const sharedPoint = scalarMultiply(privateKey, peerPublicKey);
    if (!sharedPoint) throw new Error("Invalid shared point");
    return sharedPoint;
};

module.exports = { deriveSharedSecret };
