# CSE447: Cryptography and Cryptanalysis
## Reverse Auction Gig Marketplace
### Cryptographic Implementation and Demonstration Report

**Semester:** Summer 2026  
**Submitted to:** [Instructor Name]  
**Group No.:** [Group Number]  
**Section:** [Section Number]  
**Submission Date:** [DD Month YYYY]

## Group Members

| No. | Full Name | Student ID |
|---|---|---|
| 1 | [Member 1 Full Name] | [Member 1 Student ID] |
| 2 | [Member 2 Full Name] | [Member 2 Student ID] |
| 3 | [Member 3 Full Name] | [Member 3 Student ID] |

## 1. Introduction and System Overview

### 1.1 Project Overview

The project is a reverse-auction gig marketplace. Clients create tasks and review bids from workers. Workers create professional profiles, submit bids, upload credentials, and submit completed work. Clients can select workers, manage escrow payments, review completed work, and provide reviews. Administrators verify credentials and manage disputed or sensitive workflows.

The system uses a React frontend, an Express/Node.js backend, and MongoDB through Mongoose. Cryptographic operations are performed on the backend so private keys and integrity secrets are not sent to the browser.

### 1.2 Technology Stack

- JavaScript with Node.js
- Express.js backend
- React and Vite frontend
- MongoDB with Mongoose
- Axios for frontend API requests
- bcrypt for password hashing
- JSON Web Tokens for authentication
- Multer for controlled document and evidence uploads
- Custom BigInt RSA and ECC implementations
- Node standard utilities such as `crypto.randomBytes`, `crypto.randomInt`, and SHA-256 hashing where permitted by the assignment

No third-party ECC or RSA library is used for the custom cryptographic mathematics.

### 1.3 System Architecture

```text
React frontend
    |
    | HTTP/API requests
    v
Express backend
    |
    +-- Authentication and session middleware
    +-- RBAC and ownership checks
    +-- Application crypto protection layer
    |       |
    |       +-- Custom RSA modules
    |       +-- Custom ECC modules
    |       +-- HMAC integrity modules
    |
    v
MongoDB / uploaded-file storage
```

The application layer selects the cryptographic policy for each data category. Workflow identifiers, status values, and references remain queryable. Sensitive content is protected on the backend before persistence and unprotected only after authorization.

## 2. Login and Registration Module

### 2.1 Registration Flow

```text
Registration form
    -> POST /api/auth/register
    -> Validate name, email, and password
    -> Generate bcrypt salt
    -> Hash password with bcrypt
    -> Protect selected user data with the configured RSA adapter
    -> Store the user in MongoDB
    -> Return a safe registration response
```

Passwords are never RSA- or ECC-encrypted. They are stored only as bcrypt hashes.

### 2.2 Login Flow

```text
Login form
    -> POST /api/auth/login
    -> Find the user account
    -> Compare the submitted password with bcrypt
    -> Create a signed JWT
    -> Set the HttpOnly user-session cookie
    -> Return non-secret user information
```

Protected requests are checked by the authentication middleware. The backend verifies the JWT signature and expiration before attaching the authenticated user to the request.

### 2.3 Implementation Details

| Requirement | Implementation |
|---|---|
| Login module | `backend/src/modules/auth/auth.controller.js` verifies credentials with bcrypt and signs a JWT with `JWT_SECRET`. |
| Registration module | `backend/src/modules/auth/auth.controller.js` validates input, hashes the password, and stores the user. |
| Data encrypted before storage | Selected user data uses the custom RSA application adapter. Credential content and completion notes use the custom ECC application adapter. |
| Data decrypted on retrieval | Backend controllers decrypt protected values before returning authorized API responses. |
| Authentication middleware | `backend/src/middleware/authMiddleware.js` verifies user tokens from the session cookie or compatible Bearer header. |

## 3. User Data Encryption and Decryption

### 3.1 Fields Encrypted

The central policy in `backend/src/crypto/crypto.policy.js` defines the intended categories:

| Data category | Algorithm | Protected fields |
|---|---|---|
| User | Custom RSA | name, email, bio, profileImage |
| Worker profile | Custom RSA policy | bio, skills, experience, certifications, portfolio, availability/headline where integrated |
| Credential | Custom ECC | title, issuer, description in the active credential workflow |
| Work submission | Custom ECC integration | completionNote |
| Task | Custom RSA policy | description, requirements, details |
| Bid | Custom RSA policy | proposal/message and notes |
| Review | Custom RSA policy | comment and feedback |
| Dispute | Custom RSA policy | description, evidence, resolution |
| Transaction and escrow | Custom RSA policy | configured description, details, notes, and payment-reference fields |

Operational fields such as IDs, references, status values, timestamps, amounts, and fields required for workflow queries remain plaintext by design.

The active live integrations verified for this report are credential protection and work-submission completion-note protection. Other categories have central policy/application support and should be demonstrated through their individual controller integrations before being marked fully live.

### 3.2 RSA Implementation

The custom RSA implementation uses JavaScript `BigInt` arithmetic. It includes:

- GCD and the extended Euclidean algorithm
- Modular inverse
- Fast modular exponentiation by repeated squaring
- Prime generation and Miller-Rabin testing
- RSA key generation
- Integer encryption and decryption
- Block processing for larger values
- PKCS#1 v1.5-style encryption padding in the RSA service layer
- Application and user-data adapters
- A replaceable key-provider interface

Relevant files are under `backend/src/crypto/rsa/`.

### 3.3 ECC Implementation

The custom ECC implementation uses a short-Weierstrass curve over a prime field:

```text
y^2 = x^3 + ax + b mod p
```

Parameters:

```text
p = 2^256 - 2^32 - 977
a = 0
b = 7
```

The implementation uses the published secp256k1 generator point and subgroup order. It contains:

- BigInt modular and field arithmetic
- Extended Euclidean modular inverse
- Point-at-infinity representation
- Point validation
- Point addition, doubling, negation, and subtraction
- Repeated-doubling scalar multiplication
- Key generation using secure random bytes
- ECDH shared-secret derivation
- ECDSA signing and verification
- EC-ElGamal point encryption and decryption
- Reversible UTF-8 point encoding with chunking
- Hex serialization for JSON/MongoDB compatibility

The application text-encryption interface is implemented in `ecc.application.js`. It uses EC-ElGamal rather than a third-party ECC library:

```text
Q = dG
C1 = kG
C2 = M + kQ
M = C2 - dC1
```

### 3.4 Different Uses of RSA and ECC

RSA and ECC are separate cryptographic families in the application:

- RSA protects the user-data/application categories assigned to the RSA policy and supports the existing RSA authentication/data adapters.
- ECC protects credential descriptive fields and work-submission completion notes in the active integrations.
- ECC also provides ECDH, ECDSA, and EC-ElGamal demonstrations.
- HMAC-SHA256 provides integrity protection and is not used as a replacement for either asymmetric algorithm.
- bcrypt is used only for password hashing and verification.

## 4. Password Hashing and Salting

### 4.1 Hashing Algorithm

Passwords use bcrypt, a password-hashing function designed to be computationally expensive and resistant to simple dictionary attacks. Passwords are not decrypted during login.

### 4.2 Salt Generation

The backend calls `bcrypt.genSalt(10)`. bcrypt generates and stores the salt as part of the resulting bcrypt hash string. The plaintext password is never stored.

### 4.3 Verification Process

```text
Submitted password
    -> bcrypt.compare(submittedPassword, storedHash)
    -> Match: continue authentication
    -> Mismatch: reject login
```

The login controller uses `bcrypt.compare` rather than attempting RSA or ECC decryption of the password.

## 5. Two-Factor Authentication (2FA)

### 5.1 2FA Method

The security layer contains a secure OTP service and middleware for OTP hashing, expiry, attempt limiting, and verification-state timeout. OTPs are six-digit values generated with `crypto.randomInt`, hashed with bcrypt, and checked for expiration and reuse.

The current repository implements the OTP verification mechanisms, but external OTP delivery by email or SMS is not part of the current Gig Market demo. This must be stated during demonstration rather than claiming external delivery is complete.

Configured security behavior includes:

- Six-digit cryptographically secure OTP generation
- Five-minute default expiration
- Bcrypt OTP hashing
- Attempt limiting
- Prevention of OTP reuse
- Thirty-minute verification-state timeout

### 5.2 Relevant Files

- `backend/src/crypto/otp.service.js`
- `backend/src/middleware/twoFactorMiddleware.js`
- `backend/src/middleware/rateLimitMiddleware.js`

Demonstration evidence should show one valid OTP and one invalid or expired OTP being rejected.

## 6. Key Management Module

### 6.1 Key Storage Security

The project uses replaceable development key-provider interfaces. Development RSA and ECC key pairs are generated at runtime and held in server memory. Private keys are not sent to React, returned in normal API responses, logged, or stored in ciphertext metadata.

The development provider is suitable for demonstration only. A production deployment should replace it with a managed KMS, HSM, or encrypted persistent key store.

Relevant interfaces include:

- `backend/src/crypto/rsa/rsa.keyProvider.js`
- `backend/src/crypto/rsa/dev.rsaProvider.js`
- `backend/src/crypto/ecc/ecc.keyProvider.js`

### 6.2 Key Rotation Policy

The ECC development provider exposes `rotateECCKey(keyId)`. In the demonstration provider, rotation replaces the active in-memory key. A production implementation must retain old key versions and use the ciphertext `keyId` or version metadata to decrypt existing records. Old keys must not be destroyed while records encrypted under them remain active.

## 7. Post and Profile Management

### 7.1 Post Module

Users can create and browse marketplace tasks/posts. Workflow fields such as title, category, budget, location, owner reference, and status remain queryable. Sensitive task descriptions, requirements, and details are assigned to the RSA protection policy.

The intended flow is:

```text
Create/update task
    -> validate owner and input
    -> apply the server-side crypto policy
    -> encrypt configured sensitive fields
    -> store references and workflow fields

Read task
    -> authorize requester
    -> verify integrity where protection metadata exists
    -> decrypt protected fields
    -> return the authorized response
```

Before final submission, the team should attach a live database screenshot proving which task fields are actually ciphertext in the current branch.

### 7.2 Profile Module

Users can view and update professional profiles through the worker-profile module. Profile content includes headline, bio, skills, experience, and portfolio. These are assigned to the RSA worker-profile policy. Owner references and timestamps remain plaintext for authorization and record management.

The profile workflow is:

```text
Profile form
    -> authenticated profile endpoint
    -> validate ownership and fields
    -> protect configured profile content
    -> persist the profile
    -> decrypt protected fields for authorized profile responses
```

The current codebase contains the profile CRUD flow and the central policy. The report should not claim every profile field is encrypted in the live database unless the corresponding controller path has been demonstrated.

### 7.3 Screenshots

Insert the following project screenshots:

1. Task/post creation page
2. Task/post listing page
3. Professional profile edit page
4. Professional profile view page
5. MongoDB record showing ciphertext rather than sensitive plaintext

## 8. Data Storage Security

### 8.1 Evidence of Encrypted Storage

The database should contain encrypted objects for active ECC-protected fields. For example, an encrypted completion note contains metadata similar to:

```json
{
  "algorithm": "Custom ECC ElGamal",
  "curve": "Custom secp256k1",
  "keyId": "dev-ecc-key",
  "version": 2,
  "encoding": "utf8-point-v1",
  "ciphertext": {
    "chunks": [
      {
        "length": 15,
        "C1": { "x": "...", "y": "..." },
        "C2": { "x": "...", "y": "..." }
      }
    ]
  }
}
```

Credential protected fields use the same application-level ECC representation. The original plaintext is restored only by the authorized backend response path.

Required evidence: capture a raw MongoDB document before viewing it through the API and show that the sensitive field contains ciphertext.

## 9. Message Authentication Code (MAC)

### 9.1 MAC Algorithm

The application uses HMAC-SHA256 for integrity protection. The implementation uses Node's HMAC primitive for the hash-based MAC and custom canonical serialization for deterministic object representation. The HMAC secret is loaded from an environment variable and is never sent to the frontend.

Relevant files:

- `backend/src/crypto/integrity/hmac.service.js`
- `backend/src/crypto/integrity/canonicalize.js`
- `backend/src/crypto/integrity/integrity.service.js`

### 9.2 Integrity Verification Flow

```text
Protected record
    -> canonicalize encrypted payload
    -> create HMAC-SHA256 tag
    -> store tag with protection metadata

Read protected record
    -> canonicalize stored payload
    -> recompute HMAC
    -> timing-safe comparison
    -> reject before decryption if the tag differs
```

The integrity tests cover valid tags, tampered payloads, wrong secrets, nested objects, arrays, null values, deterministic output, and property-order independence.

## 10. Role-Based Access Control (RBAC)

### 10.1 Roles Defined

- **Regular authenticated user:** creates and manages owned tasks, bids, profiles, credentials, work submissions, and reviews according to ownership rules.
- **Administrator:** manages administrative credential verification and other administrator-only operations.

### 10.2 Permission Matrix

| Operation / Resource | Admin | Regular User |
|---|---:|---:|
| View own profile | Yes | Yes |
| Edit own profile | Yes where applicable | Yes |
| Create and edit owned tasks/posts | Yes where permitted | Yes |
| Submit own credentials | Yes where permitted | Yes |
| Request verification for own credential | Yes where permitted | Yes |
| Approve or reject credentials | Yes | No |
| View pending credential queue | Yes | No |
| View another user's private records | No by default | No |
| Access owned work submissions | Yes where authorized | Yes where authorized |
| Rotate development keys | Server/provider operation | No |

Authorization is enforced on the backend. Frontend visibility is not treated as a security boundary.

## 11. Secure Session Management

### 11.1 Token Signing and Verification

The backend signs JWTs using `process.env.JWT_SECRET`. User and admin middleware verify the signature and expiration on protected requests. The current session implementation uses HttpOnly cookies with `SameSite=Strict` and `Secure` enabled in production. Credentialed CORS is configured for the frontend origin.

User session flow:

```text
Successful login
    -> JWT signed with server secret
    -> HttpOnly session cookie set
    -> browser sends cookie automatically
    -> middleware verifies JWT on each protected request
```

Logout clears the server-set cookie. Invalid or expired tokens result in HTTP 401. A valid token without the required administrator role results in HTTP 403 on administrator routes.

A Bearer-header compatibility path remains in the middleware for existing clients, but new frontend requests use credentialed cookies rather than localStorage token storage.

## 12. GitHub Repository and Project Structure

| Field | Details |
|---|---|
| GitHub Repository URL | https://github.com/tu-Rahat/Gig_market.git |
| ECC branch | `ecc_implementation` (`origin/ecc_implementation`) |
| Crypto branch | `Crypto` |
| Session branch | `crypto_ecc` (`origin/crypto_ecc`) |

### 12.1 Repository Structure

```text
backend/
  src/
    app.js
    server.js
    middleware/
    modules/
    crypto/
      rsa/
      ecc/
      integrity/
      application.protection.js
      crypto.policy.js
      otp.service.js
frontend/
  src/
    components/
    features/
    pages/
    routes/
    services/
CRYPTO_PROJECT_REPORT.md
MEMBER3_COMPLETION_SUMMARY.md
backend/src/SENSITIVE_DATA_AUDIT.md
```

### 12.2 README Overview

The frontend README is the default Vite/React README and does not yet provide a complete project-specific setup guide. The final submission should add or attach project-specific instructions covering:

```text
1. Install backend dependencies: cd backend; npm install
2. Install frontend dependencies: cd frontend; npm install
3. Configure environment variables, including MongoDB URI and JWT_SECRET
4. Start the backend server
5. Start the frontend development server
6. Run ECC, integrity, security, and regression tests
```

## 13. Conclusion

The project combines a reverse-auction marketplace with custom cryptographic components. Member 1 implemented the custom RSA layer and authentication/data adapters. Member 2 implemented ECC mathematics, key generation, ECDH, ECDSA, EC-ElGamal, serialization, and active ECC protection for credential and work-submission content. Member 3 added the application security layer, including HMAC integrity services, crypto policy, OTP/2FA mechanisms, authorization middleware, rate limiting, and security tests.

The most important implementation lesson was separating cryptographic mathematics from application workflows. The backend keeps private keys and integrity secrets server-side, leaves only necessary workflow references queryable, and decrypts protected values only after authorization. Remaining demonstration limitations, including external OTP delivery, development-only key storage, and database screenshots, should be presented honestly and completed before final submission.

## Appendix A: Verification Commands

From the repository root:

```powershell
node backend/src/crypto/ecc/tests/ecc.test.js
node backend/src/security.test.js
node -e "require('./backend/src/crypto/rsa/rsa.application'); console.log('RSA application OK')"
node -e "require('./backend/src/app'); console.log('Backend app OK')"
git diff --check
git grep -n -E '^(<<<<<<<|=======|>>>>>>>)'
```

Expected ECC result:

```text
=== ALL ECC TESTS PASSED ===
```

## Appendix B: ECC Demonstration Path

```text
Work-submission frontend form
    -> workSubmissionAPI.js
    -> workSubmission.route.js
    -> authMiddleware
    -> submitCompletedWork()
    -> configureDevelopmentECCProvider()
    -> encryptText()
    -> encodeTextPoint()
    -> encryptPoint()
    -> point operations and modular arithmetic
    -> encrypted completionNote stored in MongoDB

Authorized read
    -> getOwnerPendingSubmissions() or submission history
    -> buildSubmissionResponse()
    -> decryptText()
    -> decryptPoint()
    -> point subtraction
    -> plaintext completion note returned in the authorized API response
```
