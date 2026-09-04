const {
    gcd,
    modInverse,
    modPow
} = require("./rsa.math");

const {
    generatePrime
} = require("./rsa.prime");

/**
 * Choose a public exponent.
 *
 * 65537 is the standard practical choice
 * when it is relatively prime to phi(n).
 */
function choosePublicExponent(phi) {
    const preferred = 65537n;

    if (
        preferred < phi &&
        gcd(preferred, phi) === 1n
    ) {
        return preferred;
    }

    // Fallback search.
    let e = 3n;

    while (
        e < phi &&
        gcd(e, phi) !== 1n
    ) {
        e += 2n;
    }

    if (e >= phi) {
        throw new Error(
            "Unable to find a valid public exponent"
        );
    }

    return e;
}

/**
 * Generate RSA key pair.
 *
 * Default key size:
 * 2048 bits.
 */
async function generateKeyPair(
    keySize = 2048
) {
    if (keySize < 512) {
        throw new Error(
            "RSA key size is too small"
        );
    }

    const primeBits =
        Math.floor(keySize / 2);

    let p;
    let q;
    let n;
    let phi;
    let e;
    let d;

    while (true) {
        p = generatePrime(primeBits);
        q = generatePrime(primeBits);

        if (p === q) {
            continue;
        }

        n = p * q;

        phi =
            (p - 1n) *
            (q - 1n);

        e =
            choosePublicExponent(phi);

        if (
            gcd(e, phi) !== 1n
        ) {
            continue;
        }

        d =
            modInverse(
                e,
                phi
            );

        break;
    }

    return {
        publicKey: {
            e,
            n
        },

        privateKey: {
            d,
            n
        },

        metadata: {
            keySize,
            algorithm: "Custom RSA"
        }
    };
}

/**
 * RSA encryption of a single integer message.
 */
function encryptInteger(
    message,
    publicKey
) {
    const m = BigInt(message);
    const e = BigInt(publicKey.e);
    const n = BigInt(publicKey.n);

    if (m < 0n || m >= n) {
        throw new Error(
            "Message must satisfy 0 <= m < n"
        );
    }

    return modPow(
        m,
        e,
        n
    );
}

/**
 * RSA decryption of a single integer ciphertext.
 */
function decryptInteger(
    ciphertext,
    privateKey
) {
    const c = BigInt(ciphertext);
    const d = BigInt(privateKey.d);
    const n = BigInt(privateKey.n);

    if (c < 0n || c >= n) {
        throw new Error(
            "Ciphertext must satisfy 0 <= c < n"
        );
    }

    return modPow(
        c,
        d,
        n
    );
}

module.exports = {
    generateKeyPair,
    encryptInteger,
    decryptInteger
};