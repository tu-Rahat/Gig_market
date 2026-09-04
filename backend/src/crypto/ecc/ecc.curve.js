"use strict";

const { mod, modInverse } = require("./ecc.math");

const CURVE = {
    name: "Custom secp256k1",
    p: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn,
    a: 0n,
    b: 7n,
    G: {
        x: 55066263022277343669578718895168534326250603453777594175500187360389116729240n,
        y: 32670510020758816978083085130507043184471273380659243275938904335757337482424n
    },
    n: 115792089237316195423570985008687907852837564279074904382605163141518161494337n
};

const INFINITY = null;

const isOnCurve = (point) => {
    if (point === INFINITY) {
        return true;
    }
    if (!point || typeof point.x !== "bigint" || typeof point.y !== "bigint") {
        return false;
    }
    if (point.x < 0n || point.x >= CURVE.p || point.y < 0n || point.y >= CURVE.p) {
        return false;
    }

    return mod(point.y * point.y, CURVE.p) ===
        mod(point.x * point.x * point.x + CURVE.a * point.x + CURVE.b, CURVE.p);
};

const pointAdd = (P, Q) => {
    if (P === INFINITY) return Q;
    if (Q === INFINITY) return P;
    if (!isOnCurve(P) || !isOnCurve(Q)) {
        throw new Error("Cannot add a point outside the selected curve");
    }

    const p = CURVE.p;
    if (P.x === Q.x && mod(P.y + Q.y, p) === 0n) {
        return INFINITY;
    }

    let lambda;
    if (P.x === Q.x && P.y === Q.y) {
        lambda = mod((3n * P.x * P.x + CURVE.a) * modInverse(2n * P.y, p), p);
    } else {
        lambda = mod((Q.y - P.y) * modInverse(Q.x - P.x, p), p);
    }

    const x3 = mod(lambda * lambda - P.x - Q.x, p);
    const y3 = mod(lambda * (P.x - x3) - P.y, p);
    return { x: x3, y: y3 };
};

const scalarMultiply = (k, point = CURVE.G) => {
    if (typeof k !== "bigint" || k < 0n) {
        throw new Error("Scalar must be a non-negative BigInt");
    }
    if (!isOnCurve(point)) {
        throw new Error("Point is not on the selected curve");
    }
    if (k === 0n || point === INFINITY) return INFINITY;

    let scalar = k;
    let result = INFINITY;
    let current = point;
    while (scalar > 0n) {
        if (scalar & 1n) result = pointAdd(result, current);
        current = pointAdd(current, current);
        scalar >>= 1n;
    }
    return result;
};

const pointNegate = (point) => point === INFINITY ? INFINITY : {
    x: point.x,
    y: mod(-point.y, CURVE.p)
};

const pointSubtract = (P, Q) => pointAdd(P, pointNegate(Q));

const assertValidPoint = (point) => {
    if (!isOnCurve(point)) {
        throw new Error("Point is not on the selected curve");
    }
};

const assertValidPublicKey = (point) => {
    assertValidPoint(point);
    if (point === INFINITY || scalarMultiply(CURVE.n, point) !== INFINITY) {
        throw new Error("Point is not in the selected subgroup");
    }
};

module.exports = {
    CURVE,
    INFINITY,
    isOnCurve,
    pointAdd,
    pointNegate,
    pointSubtract,
    scalarMultiply,
    assertValidPoint,
    assertValidPublicKey
};
