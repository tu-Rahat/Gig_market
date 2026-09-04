const {
  protectRecord,
  unprotectRecord
} = require("../../crypto/application.protection");

const CRYPTO_HMAC_SECRET =
  process.env.CRYPTO_HMAC_SECRET ||
  process.env.JWT_SECRET;

const protectCredential = (credential) =>
  protectRecord(
    credential,
    "credential",
    CRYPTO_HMAC_SECRET
  );

const unprotectCredential = (credential) =>
  unprotectRecord(
    credential,
    "credential",
    CRYPTO_HMAC_SECRET
  );

const unprotectCredentials = (credentials) =>
  Promise.all(
    credentials.map((credential) =>
      unprotectCredential(
        typeof credential.toObject === "function"
          ? credential.toObject()
          : credential
      )
    )
  );

const includeProtectionMetadata = (query) =>
  query.select("+__protected");

module.exports = {
  protectCredential,
  unprotectCredential,
  unprotectCredentials,
  includeProtectionMetadata
};
