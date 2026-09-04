const {
    generateRSAKeyPair
} = require("./rsa.service");

let keys = null;

const DEV_RSA_KEY_ID = "dev-rsa-key";

const initializeDevRSAKeys = async () => {
    if (!keys) {
        keys = await generateRSAKeyPair(1024);
    }

    return keys;
};

const getPublicKey = async (keyId) => {
    if (keyId !== DEV_RSA_KEY_ID) {
        return null;
    }

    const currentKeys =
        await initializeDevRSAKeys();

    return currentKeys.publicKey;
};

const getPrivateKey = async (keyId) => {
    if (keyId !== DEV_RSA_KEY_ID) {
        return null;
    }

    const currentKeys =
        await initializeDevRSAKeys();

    return currentKeys.privateKey;
};

const getDevRSAKeyId = () =>
    DEV_RSA_KEY_ID;

module.exports = {
    initializeDevRSAKeys,
    getPublicKey,
    getPrivateKey,
    getDevRSAKeyId
};