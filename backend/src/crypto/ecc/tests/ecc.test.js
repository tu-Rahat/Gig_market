"use strict";

const assert = require("assert");
const { CURVE, INFINITY, isOnCurve, pointAdd, pointSubtract, scalarMultiply } = require("../ecc.curve");
const { generateKeyPair } = require("../ecc.keys");
const { deriveSharedSecret } = require("../ecc.ecdh");
const { sign, verify } = require("../ecc.ecdsa");
const { encryptPoint, decryptPoint } = require("../ecc.elgamal");
const { configureDevelopmentECCProvider } = require("../ecc.keyProvider");
const { encryptText, decryptText, signSerialized, verifySerialized } = require("../ecc.application");

(async () => {
    console.log("=== ECC TESTS ===");
    assert(isOnCurve(CURVE.G));
    console.log("PASS: Generator lies on curve");
    assert.deepStrictEqual(scalarMultiply(1n, CURVE.G), CURVE.G);
    assert.strictEqual(pointAdd(CURVE.G, INFINITY), CURVE.G);
    assert.strictEqual(pointAdd(CURVE.G, pointSubtract(INFINITY, CURVE.G)), INFINITY);
    console.log("PASS: Identity and inverse");
    assert(isOnCurve(pointAdd(CURVE.G, CURVE.G)));
    console.log("PASS: Point doubling");
    assert.strictEqual(scalarMultiply(CURVE.n, CURVE.G), INFINITY);
    console.log("PASS: nG = O");

    const alice = generateKeyPair();
    const bob = generateKeyPair();
    assert(alice.privateKey > 0n && alice.privateKey < CURVE.n && isOnCurve(alice.publicKey));
    console.log("PASS: Key generation");
    assert.deepStrictEqual(deriveSharedSecret(alice.privateKey, bob.publicKey), deriveSharedSecret(bob.privateKey, alice.publicKey));
    console.log("PASS: ECDH shared secret");

    const message = "CSE447 ECC test message";
    const signature = sign(message, alice.privateKey);
    assert(verify(message, signature, alice.publicKey));
    assert(!verify(`${message} tampered`, signature, alice.publicKey));
    assert(!verify(message, { r: signature.r + 1n, s: signature.s }, alice.publicKey));
    assert(!verify(message, signature, { x: 1n, y: 1n }));
    console.log("PASS: ECDSA valid and negative cases");

    const encryptedPoint = encryptPoint(CURVE.G, bob.publicKey);
    assert.deepStrictEqual(decryptPoint(encryptedPoint, bob.privateKey), CURVE.G);
    console.log("PASS: EC-ElGamal point encryption");

    assert.throws(() => deriveSharedSecret(0n, bob.publicKey), /Invalid private key/);
    assert.throws(() => deriveSharedSecret(alice.privateKey, { x: 1n, y: 1n }), /curve|subgroup/i);
    assert.throws(() => sign(message, CURVE.n), /Invalid private key/);
    console.log("PASS: Invalid key and peer rejection");

    const keyId = configureDevelopmentECCProvider();
    const encryptedText = await encryptText("hello ECC", keyId);
    assert.strictEqual(await decryptText(encryptedText, keyId), "hello ECC");
    const encryptedEmptyText = await encryptText("", keyId);
    assert.strictEqual(await decryptText(encryptedEmptyText, keyId), "");
    const serializedSignature = await signSerialized(message, keyId);
    assert(await verifySerialized(message, serializedSignature, keyId));
    console.log("PASS: Managed application API and serialization");
    console.log("=== ALL ECC TESTS PASSED ===");
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
