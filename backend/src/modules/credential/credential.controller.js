const fs = require("fs");
const Credential = require(
  "./credential.model"
);
const {
  protectCredential,
  unprotectCredential,
  includeProtectionMetadata
} = require("./credential.crypto");

const removeUploadedFile = (file) => {
  if (!file?.path) {
    return;
  }
  fs.unlink(file.path, () => {});
};

const uploadCredentialDocument = async (
  req,
  res
) => {
  try {
    const {
      credentialType,
      title,
      issuer = "",
      description = "",
      issuedDate = ""
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message:
          "Credential document is required"
      });
    }

    if (
      !credentialType ||
      ![
        "certificate",
        "license",
        "experience"
      ].includes(credentialType)
    ) {
      removeUploadedFile(req.file);
      return res.status(400).json({
        message:
          "Credential type must be certificate, license, or experience"
      });
    }

    if (!title || !title.trim()) {
      removeUploadedFile(req.file);
      return res.status(400).json({
        message:
          "Credential title is required"
      });
    }

    let parsedIssuedDate = null;
    if (issuedDate) {
      parsedIssuedDate =
        new Date(issuedDate);
      if (
        Number.isNaN(
          parsedIssuedDate.getTime()
        )
      ) {
        removeUploadedFile(req.file);
        return res.status(400).json({
          message:
            "Issued date is invalid"
        });
      }
    }

    const protectedCredential = await protectCredential({
        owner: req.user.id,
        credentialType,
        title: title.trim(),
        issuer: issuer.trim(),
        description:
          description.trim(),
        issuedDate:
          parsedIssuedDate,
        document: {
          originalName:
            req.file.originalname,
          storedName:
            req.file.filename,
          mimeType:
            req.file.mimetype,
          filePath:
            req.file.path,
          fileSize:
            req.file.size
        }
      });
    const credential = await Credential.create(protectedCredential);
    const responseCredential = await unprotectCredential(
      credential.toObject()
    );

    return res.status(201).json({
      message:
        "Credential uploaded successfully",
      credential: responseCredential
    });
  } catch (error) {
    removeUploadedFile(req.file);
    return res.status(500).json({
      message:
        "Failed to upload credential",
      error: error.message
    });
  }
};

const getMyCredentials = async (
  req,
  res
) => {
  try {
    const storedCredentials =
      includeProtectionMetadata(Credential.find({
        owner: req.user.id
      })).sort({
        createdAt: -1
      });

    const credentials = await Promise.all(
      storedCredentials.map(unprotectCredential)
    );

    return res.status(200).json({
      count: credentials.length,
      credentials
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to load credentials",
      error: error.message
    });
  }
};


const requestCredentialVerification = async (
  req,
  res
) => {
  try {
    let credential =
      await Credential.findById(
        req.params.id
      );

    if (!credential) {
      return res.status(404).json({
        message:
          "Credential not found"
      });
    }

    if (
      credential.owner.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only request verification for your own credential"
      });
    }

    if (
      credential.verificationStatus ===
      "pending"
    ) {
      return res.status(400).json({
        message:
          "Verification request is already pending"
      });
    }

    if (
      credential.verificationStatus ===
      "verified"
    ) {
      return res.status(400).json({
        message:
          "This credential is already verified"
      });
    }

    const plainCredential = await unprotectCredential(
      credential.toObject()
    );
    plainCredential.verificationStatus =
      "pending";
    plainCredential.verificationRequestedAt =
      new Date();
    plainCredential.rejectionReason = "";
    const protectedCredential = await protectCredential(
      plainCredential
    );
    await Credential.replaceOne(
      { _id: credential._id },
      protectedCredential
    );
    credential = await unprotectCredential(protectedCredential);

    return res.status(200).json({
      message:
        "Credential verification request submitted",
      credential
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to request credential verification",
      error: error.message
    });
  }
};

const deleteCredential = async (
  req,
  res
) => {
  try {
    const credential =
      await Credential.findById(
        req.params.id
      );

    if (!credential) {
      return res.status(404).json({
        message:
          "Credential not found"
      });
    }

    if (
      credential.owner.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own credential"
      });
    }

    if (
      credential.verificationStatus ===
      "pending"
    ) {
      return res.status(400).json({
        message:
          "A credential with a pending verification request cannot be deleted"
      });
    }

    if (
      credential.document?.filePath
    ) {
      fs.unlink(
        credential.document.filePath,
        () => {}
      );
    }

    await credential.deleteOne();

    return res.status(200).json({
      message:
        "Credential deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to delete credential",
      error: error.message
    });
  }
};

module.exports = {
  uploadCredentialDocument,
  getMyCredentials,
  requestCredentialVerification,
  deleteCredential
};