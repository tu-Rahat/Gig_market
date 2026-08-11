const express = require("express");
const protect = require(
  "../../middleware/authMiddleware"
);
const uploadCredential = require(
  "./credential.upload"
);
const {
  uploadCredentialDocument,
  getMyCredentials,
  updateCredential,
  requestCredentialVerification,
  deleteCredential
} = require(
  "./credential.controller"
);

const router = express.Router();

router.get(
  "/mine",
  protect,
  getMyCredentials
);

router.post(
  "/upload",
  protect,
  uploadCredential.single("document"),
  uploadCredentialDocument
);

router.patch(
  "/:id",
  protect,
  uploadCredential.single("document"),
  updateCredential
);

router.patch(
  "/:id/request-verification",
  protect,
  requestCredentialVerification
);

router.delete(
  "/:id",
  protect,
  deleteCredential
);

module.exports = router;