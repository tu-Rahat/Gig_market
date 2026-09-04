# Cryptography Project Report

## Member 1 — RSA

### Branch

member1-rsa

### Completed

- RSA mathematical utilities
- GCD
- Extended Euclidean Algorithm
- Modular inverse
- Fast modular exponentiation
- Prime generation
- Miller-Rabin primality testing
- RSA key generation
- RSA integer encryption
- RSA integer decryption

### RSA Design

RSA is implemented manually using JavaScript BigInt arithmetic.

### Key Generation

1. Generate prime p.
2. Generate prime q.
3. Calculate n = p × q.
4. Calculate φ(n) = (p − 1)(q − 1).
5. Select public exponent e.
6. Calculate private exponent d using modular inverse.
7. Public key = (e, n).
8. Private key = (d, n).

### Modular Exponentiation

Fast modular exponentiation using repeated squaring is used for RSA encryption and decryption.

### Testing

- GCD test: PASS
- Modular inverse test: PASS
- Modular exponentiation test: PASS
- RSA key generation: PASS
- RSA encryption/decryption round trip: PASS

### Files

- backend/src/crypto/rsa/rsa.math.js
- backend/src/crypto/rsa/rsa.prime.js
- backend/src/crypto/rsa/rsa.js

### Git

Commit:
<ADD COMMIT HASH>

Push status:
Pending

## RSA Block Encryption

Large plaintext data is divided into RSA-compatible blocks.

The maximum plaintext size is calculated from the RSA modulus size.

## Padding Scheme

RSA PKCS#1 v1.5 encryption padding is used.

Each encoded block follows:

00 || 02 || PS || 00 || M

where PS is a randomly generated non-zero padding string with
a minimum length of 8 bytes.

This prevents direct raw RSA encryption of plaintext blocks
and provides randomized ciphertext for identical plaintext.

## Block Processing

Plaintext:
UTF-8 data
↓
Split into blocks
↓
PKCS#1 v1.5 padding
↓
RSA modular exponentiation
↓
Ciphertext blocks

During decryption the reverse process is performed.

## Tests

- String encryption/decryption: PASS
- JSON encryption/decryption: PASS
- Multi-block encryption/decryption: PASS
- Unicode encryption/decryption: PASS
- Randomized padding: PASS
- Invalid/tampered ciphertext rejection: PASS

## Final Member 1 Verification

### RSA Core

PASS

### RSA Service

PASS

### Multi-block Encryption

PASS

### PKCS#1 v1.5 Padding

PASS

### JSON Encryption/Decryption

PASS

### Unicode Encryption/Decryption

PASS

### Randomized Encryption

PASS

### Invalid Ciphertext Handling

PASS

### Application Integration

PASS

### MongoDB Verification

PASS

### Existing Gig Market Regression Testing

PASS

## Final Status

Member 1 RSA implementation is complete.

## Member 2 - Custom ECC

### Curve

- Curve: custom from-scratch secp256k1 short-Weierstrass curve
- Equation: `y^2 = x^3 + ax + b mod p`
- `p = 2^256 - 2^32 - 977`
- `a = 0`, `b = 7`
- `G` and `n` use the published secp256k1 generator and subgroup order

### From-Scratch Mathematics

- BigInt modular reduction, field arithmetic, extended Euclidean algorithm, and modular inverse
- Point-at-infinity identity, point validation, addition, doubling, negation, subtraction, and repeated-doubling scalar multiplication
- Public keys are checked for curve membership and subgroup membership

### Key Generation

Private scalars are generated with Node's secure `randomBytes` utility and public keys are derived using the custom scalar multiplication implementation. Private keys are held only by the development provider at runtime.

### ECDH

Alice and Bob derive `a(bG)` and `b(aG)` respectively. The resulting curve points are equal. Invalid private keys and peer points are rejected.

### ECDSA

Signing and verification use the custom ECDSA equations with SHA-256 only as the message hash. Valid signatures pass and modified messages, invalid signatures, and invalid public points fail.

### EC-ElGamal

Point encryption uses `C1 = kG` and `C2 = M + kQ`; decryption computes `M = C2 - dC1`. The application text API uses a documented try-and-increment-style mapping: the UTF-8 integer is multiplied by 256 and a counter is added until the resulting x-coordinate has a curve square root. Text is limited to 29 UTF-8 bytes for this academic point encoding.

### Key Provider

`configureDevelopmentECCProvider`, `getECCPublicKey`, `getECCPrivateKey`, and `rotateECCKey` provide a replaceable development adapter. Rotation replaces the active development key; production rotation must retain old key versions for existing ciphertext.

### Application API

Member 3 can use `encryptText`, `decryptText`, `signWithManagedKey`, `verifyWithManagedKey`, `signSerialized`, `verifySerialized`, and `deriveSharedSecret` from `backend/src/crypto/ecc/ecc.application.js`. Point and signature serialization converts BigInt values to hexadecimal strings and ciphertext metadata includes algorithm, curve, key ID, version, and encoding.

### Security

No built-in ECC operation or ECC library is used. Private keys are not returned by the application API, logged, sent to React, or stored in ciphertext metadata. Inputs are validated and random scalars use Node's secure random byte generator.

### Tests

Command: `node backend/src/crypto/ecc/tests/ecc.test.js`

Result: PASS. Tests cover curve arithmetic, identity and inverse, subgroup order, key generation, ECDH, ECDSA, EC-ElGamal, managed API serialization, invalid points, invalid signatures, tampered messages, invalid peers, and invalid private keys.

RSA application/provider loading and backend application loading were also checked after the ECC package was added.

### Files Changed

- `backend/src/crypto/ecc/ecc.math.js`
- `backend/src/crypto/ecc/ecc.curve.js`
- `backend/src/crypto/ecc/ecc.keys.js`
- `backend/src/crypto/ecc/ecc.ecdh.js`
- `backend/src/crypto/ecc/ecc.ecdsa.js`
- `backend/src/crypto/ecc/ecc.elgamal.js`
- `backend/src/crypto/ecc/ecc.serialization.js`
- `backend/src/crypto/ecc/ecc.keyProvider.js`
- `backend/src/crypto/ecc/ecc.application.js`
- `backend/src/crypto/ecc/tests/ecc.test.js`

### Git

- Branch: `crypto_ecc`
- Commit and push status: performed by the repository owner when ready

Branch:
member1-rsa

Latest Commit:
<ADD HASH>

Remote:
origin/member1-rsa

Working Tree:
Clean

Push Status:
Complete
