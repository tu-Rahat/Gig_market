const express = require("express");
const cors = require("cors");
const adminRoutes = require(
 "./modules/admin/admin.route"
);

const authRoutes = require(
    "./modules/auth/auth.route"
);

const categoryRoutes = require(
    "./modules/category/category.route"
);

const taskRoutes = require(
    "./modules/task/task.route"
);

const escrowRoutes = require(
    "./modules/escrow/escrow.route"
);

const countdownRoutes = require(
    "./modules/countdown/countdown.route"
);

const workSubmissionRoutes = require(
    "./modules/workSubmission/workSubmission.route"
);

const disputeRoutes = require(
    "./modules/dispute/dispute.route"
);
const transactionRoutes = require(
    "./modules/transaction/transaction.route"
);

const credentialRoutes = require(
    "./modules/credential/credential.route"
);

const bidRoutes = require(
    "./modules/bid/bid.route"
);
const workerProfileRoutes = require(
 "./modules/workerProfile/workerProfile.route"
);
const bidderFilterRoutes = require(
 "./modules/bidderFilter/bidderFilter.route"
);


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/countdowns", countdownRoutes);
app.use("/api/work-submissions",workSubmissionRoutes);
app.use("/api/credentials",credentialRoutes);
app.use("/api/worker-profiles",workerProfileRoutes);
app.use("/api/bidder-filter",bidderFilterRoutes);
app.use("/api/transactions",transactionRoutes);
// app.use(
//     "/api/auth",
//     authRoutes
// );

// app.use(
//     "/api/categories",
//     categoryRoutes
// );

// app.use(
//     "/api/tasks",
//     taskRoutes
// );

// app.use(
//     "/api/escrow",
//     escrowRoutes
// );

// app.use(
//     "/api/countdowns",
//     countdownRoutes
// );

// app.use(
//     "/api/work-submissions",
//     workSubmissionRoutes
// );

app.use(
    "/api/disputes",
    disputeRoutes
);

// app.use(
//     "/api/credentials",
//     credentialRoutes
// );

app.use(
    "/api/bids",
    bidRoutes
);
app.use(
    "/api/admin",
    adminRoutes
);

// Test API
app.get("/", (req, res) => {
    res.send(
        "Gig Market Backend is Running"
    );
});


module.exports = app;