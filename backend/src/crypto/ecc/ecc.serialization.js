"use strict";

const { assertValidPoint } = require("./ecc.curve");

const bigIntToHex = (value) => value.toString(16);
const hexToBigInt = (value) => BigInt(`0x${value}`);

const serializePoint = (point) => {
    if (!point) return null;
    assertValidPoint(point);
    return { x: bigIntToHex(point.x), y: bigIntToHex(point.y) };
};

const deserializePoint = (point) => {
    if (!point || typeof point.x !== "string" || typeof point.y !== "string") return null;
    const result = { x: hexToBigInt(point.x), y: hexToBigInt(point.y) };
    assertValidPoint(result);
    return result;
};

const serializeSignature = (signature) => ({ r: bigIntToHex(signature.r), s: bigIntToHex(signature.s) });
const deserializeSignature = (signature) => ({ r: hexToBigInt(signature.r), s: hexToBigInt(signature.s) });

module.exports = { bigIntToHex, hexToBigInt, serializePoint, deserializePoint, serializeSignature, deserializeSignature };
