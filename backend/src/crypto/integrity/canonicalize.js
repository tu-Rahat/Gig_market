"use strict";

/**
 * Canonical Serialization for Deterministic HMAC
 * 
 * Converts JavaScript objects to a canonical JSON representation
 * that will always produce the same output for the same input,
 * regardless of property order.
 * 
 * @param {*} value - The value to canonicalize
 * @returns {string} - Canonical JSON representation
 */
const canonicalize = (value) => {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return "[" +
            value.map(canonicalize).join(",") +
            "]";
    }

    return "{" +
        Object.keys(value)
            .sort()
            .map(
                (key) =>
                    JSON.stringify(key) +
                    ":" +
                    canonicalize(value[key])
            )
            .join(",") +
        "}";
};

module.exports = {
    canonicalize
};
