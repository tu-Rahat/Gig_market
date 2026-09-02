require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const {
    releaseOverduePayments
} = require("./modules/escrow/autoRelease.service");

const PORT = process.env.PORT || 5000;


// Connect Database
connectDB();


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});


// Feature 19:
// Check for overdue escrow payments
// every hour.
setInterval(
    async () => {

        try {

            const releasedCount =
                await releaseOverduePayments();

            if (releasedCount > 0) {

                console.log(
                    `Auto-release: ${releasedCount} payment(s) released`
                );

            }

        } catch (error) {

            console.error(
                "Auto-release scheduler failed:",
                error
            );

        }

    },
    10 * 1000
);