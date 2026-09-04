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
