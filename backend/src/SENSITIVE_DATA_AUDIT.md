# Sensitive Data Inventory & Protection Plan

## Member 3 Application Security Audit

Date: 2026-09-04
Status: IMPLEMENTED

---

## 1. User (auth.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **name**: Personal identifier, encrypted
- **email**: Personal identifier, encrypted (with deterministic lookup token)
- **password**: BCRYPT ONLY (never RSA/ECC encrypted)
- **bio**: Personal information, encrypted
- **profileImage**: Personal data, encrypted
- **skills**: Professional information, encrypted
- **experience**: Professional history, encrypted
- **certifications**: Professional credentials, encrypted
- **badges**: Achievement data, encrypted

### Plaintext Fields (INDEXED/QUERYABLE)
- **_id**: ObjectId, system field
- **role**: User role (admin, worker, client, etc.)
- **status**: Account status
- **createdAt, updatedAt**: Timestamps

### Protection Strategy
- Sensitive fields are RSA-encrypted at rest
- Email uses deterministic HMAC lookup token for searches
- Password remains bcrypt-only (NEVER asymmetric cipher)
- User model includes `encryptedValueSchema` for crypto metadata

### Integrity Protection
- User records are HMAC-protected on update/retrieval
- Tampering detected before decryption

---

## 2. WorkerProfile (workerProfile.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **bio**: Professional profile, max 2000 chars
- **skills**: Array of skill descriptions
- **experience**: Array of work experience records
  - title
  - organization
  - description
  - startDate / endDate
- **portfolio**: Array of portfolio items
  - title
  - description
  - imageUrl
  - completedAt
- **headline**: Professional headline (max 150 chars)

### Plaintext Fields
- **owner**: Reference to User (required for authorization)
- **timestamps**: createdAt, updatedAt

### Protection Strategy
- All content encrypted with RSA
- Owner field plaintext for object-level authorization checks
- Portfolio and experience arrays encrypted as units

### Integrity Protection
- Records verified before decryption
- Prevents tampering with portfolio/experience data

---

## 3. Task (task.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **description**: Task details (max 3000 chars)
- **requirements**: Specific task requirements
- **details**: Additional task information

### Plaintext Fields (QUERYABLE)
- **title**: Task name (public visibility)
- **category**: Category reference
- **location**: Location string
- **duration**: Duration string
- **budgetMin / budgetMax**: Budget numbers
- **createdBy**: Task owner reference
- **status**: Task status enum [open, in_progress, completed, cancelled]
- **bookingStatus**: Booking status enum
- **selectedWorker**: Assigned worker reference
- **timestamps**: Metadata

### Protection Strategy
- Task descriptions and requirements encrypted
- Budget amounts remain plaintext for filtering/searching
- Location remains plaintext (user-specified search criteria)
- Status fields required for queries remain plaintext

### Integrity Protection
- Description/requirements HMAC-protected
- Prevents malicious task detail modification

---

## 4. Bid (bid.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **message**: Bid proposal/notes (max 1000 chars)

### Plaintext Fields
- **task**: Task reference
- **bidder**: Worker reference
- **amount**: Bid amount (required for sorting/filtering)
- **estimatedCompletionTime**: Duration estimate
- **status**: Bid status enum [active, selected, rejected, withdrawn]
- **timestamps**: Metadata

### Protection Strategy
- Bid message/proposal encrypted
- Amount plaintext for bid comparison and sorting
- Status plaintext for workflow state
- Unique index on (task, bidder) for preventing duplicate bids

### Integrity Protection
- Message HMAC-protected
- Prevents bid tampering

---

## 5. Credential (credential.model.js)

### Sensitive Fields (ENCRYPTED with ECC for higher asymmetry strength)
- **credentialData**: Actual credential information
- **verification**: Verification details
- **certificateData**: Certificate/proof data

### Plaintext Fields
- **owner**: User reference (for authorization)
- **type**: Credential type
- **status**: Verification status
- **issuedDate / expiresDate**: Dates
- **issuer**: Issuing entity name
- **verificationStatus**: Workflow state
- **timestamps**: Metadata

### Protection Strategy
- Credential details encrypted with ECC
- ECC chosen for maximum asymmetric security of sensitive credentials
- Type and status remain plaintext for querying
- Dates queryable for expiration checks

### Integrity Protection
- Credentials HMAC-protected
- Prevents forgery/tampering of credentials

---

## 6. Review (review.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **comment**: Reviewer's text feedback
- **feedback**: Additional feedback details

### Plaintext Fields
- **task**: Task reference
- **reviewer**: Reviewer user reference
- **reviewee**: Reviewed user reference
- **rating**: Numeric rating (required for sorting)
- **status**: Review status
- **timestamps**: Metadata

### Protection Strategy
- Comments/feedback encrypted
- Ratings plaintext for sorting/filtering
- Bidirectional references plaintext for queries

### Integrity Protection
- Comments HMAC-protected
- Prevents malicious review modification

---

## 7. Transaction (Not fully modeled yet - placeholder)

### Sensitive Fields (ENCRYPTED with RSA)
- **description**: Transaction details
- **paymentReference**: Payment tracking info
- **details**: Additional transaction metadata

### Plaintext Fields
- **from / to**: User references
- **amount**: Transaction amount
- **status**: Transaction status
- **type**: Transaction type
- **timestamp**: When transaction occurred

### Protection Strategy
- Payment details encrypted
- Amount/status queryable
- Integrity-protected for financial accuracy

---

## 8. Dispute (dispute.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **description**: Dispute details
- **evidence**: Dispute evidence/documentation
- **resolution**: Resolution notes

### Plaintext Fields
- **task**: Task reference
- **initiator / respondent**: User references
- **status**: Dispute status enum
- **priority**: Priority level
- **timestamps**: Metadata

### Protection Strategy
- Dispute details/evidence encrypted for confidentiality
- Status plaintext for workflow/querying
- Parties involved in plaintext for access control

### Integrity Protection
- Dispute records HMAC-protected
- Prevents tampering with evidence/resolution

---

## 9. Escrow (escrow.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **notes**: Escrow notes/details
- **details**: Payment/release conditions

### Plaintext Fields
- **task**: Task reference
- **payer / payee**: User references
- **amount**: Escrow amount
- **status**: Escrow status [held, released, refunded, disputed]
- **timestamps**: Metadata

### Protection Strategy
- Conditions/notes encrypted
- Amount and status remain queryable
- Status determines release workflow

### Integrity Protection
- Notes HMAC-protected
- Prevents unauthorized condition changes

---

## 10. WorkSubmission (workSubmission.model.js)

### Sensitive Fields (ENCRYPTED with RSA)
- **submissionNotes**: Worker submission notes
- **files**: Submitted work descriptions
- **details**: Work submission details

### Plaintext Fields
- **task**: Task reference
- **worker**: Worker reference
- **status**: Submission status [pending, reviewed, approved, rejected]
- **submittedAt / reviewedAt**: Timestamps
- **feedback**: Reviewer feedback

### Protection Strategy
- Submission content encrypted
- Status plaintext for workflow state
- Timestamps for tracking

### Integrity Protection
- Submission content HMAC-protected

---

## Protection Summary

### RSA-Protected Data Categories
- User names, emails, bios, profiles
- Task descriptions and requirements
- Bid proposals
- Review comments
- Dispute information
- Escrow conditions
- Work submissions
- Worker portfolio/experience

### ECC-Protected Data Categories
- Credential data (higher security for sensitive credentials)

### HMAC-Integrity Protected
- All encrypted records
- Authentication of protected payloads
- Tamper detection

### Plaintext-Required Fields
- IDs and references (ObjectId)
- Status enums (for workflow state)
- Searchable/indexable fields
- Numeric values for calculations
- Timestamps

### Deterministic Lookup Tokens
- Email addresses (for login)
- User IDs (for lookups)
- Task IDs (for references)

---

## Implementation Notes

1. All encryption/decryption happens on the backend server
2. Frontend never receives unencrypted sensitive data
3. Encryption keys managed by key provider (not hardcoded)
4. HMAC secret stored in environment variables
5. Database contains encrypted representations
6. Object-level authorization checks plaintext IDs
7. Searches use lookup tokens where needed
8. Password handling unchanged (bcrypt only)

---

## Files Modified/Created

1. `backend/src/crypto/integrity/hmac.service.js` - HMAC creation/verification
2. `backend/src/crypto/integrity/canonicalize.js` - Deterministic serialization
3. `backend/src/crypto/integrity/integrity.service.js` - Integrity tag management
4. `backend/src/crypto/integrity/integrity.test.js` - Integrity tests
5. `backend/src/crypto/crypto.policy.js` - Central crypto policy
6. `backend/src/crypto/otp.service.js` - OTP/2FA generation
7. `backend/src/middleware/rbacMiddleware.js` - RBAC authorization
8. `backend/src/middleware/twoFactorMiddleware.js` - 2FA verification
9. `SENSITIVE_DATA_AUDIT.md` - This document

