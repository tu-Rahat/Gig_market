const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Upload directory
const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "disputes"
);


// Create directory if it does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );
}


// Store files on disk
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDir
        );

    },

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${path.extname(file.originalname)}`;

        cb(
            null,
            uniqueName
        );

    }

});


// Allowed evidence types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
];


const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        allowedMimeTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, PNG, WEBP images and PDF files are allowed"
            ),
            false
        );

    }

};


// Multiple evidence files
const uploadDisputeEvidence =
    multer({

        storage,

        fileFilter,

        limits: {

            // Maximum 5 files
            files: 5,

            // Maximum 10 MB per file
            fileSize:
                10 * 1024 * 1024

        }

    });


module.exports =
    uploadDisputeEvidence;