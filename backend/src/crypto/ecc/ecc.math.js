"use strict";

const mod = (value, modulus) => {
    if (modulus <= 0n) {
        throw new Error("Modulus must be positive");
    }

    const result = value % modulus;
    return result >= 0n ? result : result + modulus;
};

const extendedGCD = (a, b) => {
    let oldR = a;
    let r = b;
    let oldS = 1n;
    let s = 0n;
    let oldT = 0n;
    let t = 1n;

    while (r !== 0n) {
        const quotient = oldR / r;
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
        [oldT, t] = [t, oldT - quotient * t];
    }

    if (oldR < 0n) {
        return { gcd: -oldR, x: -oldS, y: -oldT };
    }

    return { gcd: oldR, x: oldS, y: oldT };
};

const modInverse = (value, modulus) => {
    const result = extendedGCD(mod(value, modulus), modulus);
    if (result.gcd !== 1n) {
        throw new Error("Modular inverse does not exist");
    }

    return mod(result.x, modulus);
};

const fieldAdd = (a, b, p) => mod(a + b, p);
const fieldSub = (a, b, p) => mod(a - b, p);
const fieldMul = (a, b, p) => mod(a * b, p);

const fieldPow = (base, exponent, p) => {
    if (exponent < 0n) {
        throw new Error("Exponent cannot be negative");
    }

    let result = 1n;
    let current = mod(base, p);
    let remaining = exponent;

    while (remaining > 0n) {
        if (remaining & 1n) {
            result = fieldMul(result, current, p);
        }
        current = fieldMul(current, current, p);
        remaining >>= 1n;
    }

    return result;
};

module.exports = {
    mod,
    extendedGCD,
    modInverse,
    fieldAdd,
    fieldSub,
    fieldMul,
    fieldPow
};
