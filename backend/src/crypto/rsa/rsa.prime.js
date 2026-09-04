const crypto = require("crypto");
const { gcd } = require("./rsa.math");

/**
 * Generate a random BigInt with the requested number of bits.
 *
 * crypto.randomBytes is used only as the source of
 * random entropy. RSA mathematics itself is implemented
 * manually.
 */
function randomBigInt(bits) {
    const byteLength = Math.ceil(bits / 8);

    const bytes = crypto.randomBytes(byteLength);

    // Force the highest bit so the number has the requested size.
    const highestBit = (bits - 1) % 8;

    bytes[0] |= (1 << highestBit);

    // Force odd number.
    bytes[bytes.length - 1] |= 1;

    return BigInt(
        "0x" + bytes.toString("hex")
    );
}

/**
 * Generate a random BigInt below a limit.
 */
function randomBelow(max) {
    if (max <= 0n) {
        throw new Error(
            "Maximum must be positive"
        );
    }

    const bitLength =
        max.toString(2).length;

    while (true) {
        const candidate =
            randomBigInt(bitLength);

        if (candidate < max) {
            return candidate;
        }
    }
}

/**
 * Miller-Rabin primality test.
 *
 * This is used to determine whether a candidate
 * number is probably prime.
 */
function isProbablePrime(
    n,
    rounds = 32
) {
    n = BigInt(n);

    if (n === 2n || n === 3n) {
        return true;
    }

    if (n < 2n || n % 2n === 0n) {
        return false;
    }

    // Write:
    //
    // n - 1 = d * 2^s
    //
    let d = n - 1n;
    let s = 0;

    while (d % 2n === 0n) {
        d /= 2n;
        s++;
    }

    for (
        let round = 0;
        round < rounds;
        round++
    ) {
        const a =
            2n +
            randomBelow(n - 3n);

        let x = modularPower(
            a,
            d,
            n
        );

        if (
            x === 1n ||
            x === n - 1n
        ) {
            continue;
        }

        let probablyPrime = false;

        for (
            let r = 1;
            r < s;
            r++
        ) {
            x =
                (x * x) % n;

            if (x === n - 1n) {
                probablyPrime = true;
                break;
            }
        }

        if (!probablyPrime) {
            return false;
        }
    }

    return true;
}

/**
 * Local modular exponentiation used during
 * primality testing.
 *
 * Kept here to keep prime-generation logic
 * self-contained.
 */
function modularPower(
    base,
    exponent,
    modulus
) {
    let result = 1n;

    base =
        ((base % modulus) +
            modulus) %
        modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result =
                (result * base) %
                modulus;
        }

        base =
            (base * base) %
            modulus;

        exponent /= 2n;
    }

    return result;
}

/**
 * Generate a probable prime.
 */
function generatePrime(
    bits = 1024
) {
    while (true) {
        const candidate =
            randomBigInt(bits);

        if (
            isProbablePrime(
                candidate
            )
        ) {
            return candidate;
        }
    }
}

module.exports = {
    randomBigInt,
    isProbablePrime,
    generatePrime
};