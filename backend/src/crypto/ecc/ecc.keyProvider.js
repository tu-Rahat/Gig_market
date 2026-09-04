"use strict";

const { generateKeyPair } = require("./ecc.keys");

const keys = new Map();
const DEV_ECC_KEY_ID = "dev-ecc-key";

const configureDevelopmentECCProvider = () => {
    if (!keys.has(DEV_ECC_KEY_ID)) keys.set(DEV_ECC_KEY_ID, generateKeyPair());
    return DEV_ECC_KEY_ID;
};

const getKey = (keyId) => {
    if (!keyId || !keys.has(keyId)) throw new Error(`ECC key not found: ${keyId}`);
    return keys.get(keyId);
};

const getECCPublicKey = async (keyId) => getKey(keyId).publicKey;
const getECCPrivateKey = async (keyId) => getKey(keyId).privateKey;

const rotateECCKey = (keyId = DEV_ECC_KEY_ID) => {
    const keyPair = generateKeyPair();
    keys.set(keyId, keyPair);
    return keyPair.publicKey;
};

module.exports = { configureDevelopmentECCProvider, getECCPublicKey, getECCPrivateKey, rotateECCKey };
