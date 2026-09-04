/**
 * RSA Mathematical Utilities
 *
 * These functions are implemented manually for the cryptography project.
 */

/**
 * Greatest Common Divisor
 */
function gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);

    while (b !== 0n) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a < 0n ? -a : a;
}

/**
 * Extended Euclidean Algorithm
 *
 * Returns:
 * ax + by = gcd(a, b)
 */
function extendedGcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);

    let oldR = a;
    let r = b;

    let oldS = 1n;
    let s = 0n;

    let oldT = 0n;
    let t = 1n;

    while (r !== 0n) {
        const quotient = oldR / r;

        [oldR, r] = [
            r,
            oldR - quotient * r
        ];

        [oldS, s] = [
            s,
            oldS - quotient * s
        ];

        [oldT, t] = [
            t,
            oldT - quotient * t
        ];
    }

    return {
        gcd: oldR,
        x: oldS,
        y: oldT
    };
}

/**
 * Modular inverse
 *
 * Finds x such that:
 *
 * (a * x) mod m = 1
 */
function modInverse(a, m) {
    a = BigInt(a);
    m = BigInt(m);

    const result = extendedGcd(a, m);

    if (result.gcd !== 1n) {
        throw new Error(
            "Modular inverse does not exist"
        );
    }

    return ((result.x % m) + m) % m;
}

/**
 * Fast modular exponentiation
 *
 * Calculates:
 *
 * base^exponent mod modulus
 *
 * using repeated squaring.
 */
function modPow(base, exponent, modulus) {
    base = BigInt(base);
    exponent = BigInt(exponent);
    modulus = BigInt(modulus);

    if (modulus <= 0n) {
        throw new Error(
            "Modulus must be positive"
        );
    }

    if (exponent < 0n) {
        throw new Error(
            "Exponent cannot be negative"
        );
    }

    let result = 1n;
    base = ((base % modulus) + modulus) % modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }

        base = (base * base) % modulus;
        exponent = exponent / 2n;
    }

    return result;
}

module.exports = {
    gcd,
    extendedGcd,
    modInverse,
    modPow
};