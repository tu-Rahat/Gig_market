const Escrow = require("./escrow.model");

// Feature 19:
// Automatically release escrow payments
// when the customer does not respond within 24 hours.
const releaseOverduePayments = async () => {
    try {

        const now = new Date();

        const overdueEscrows =
            await Escrow.find({
                status: "held",

                approvalDeadline: {
                    $ne: null,
                    $lte: now
                }
            });


        let releasedCount = 0;


        for (const escrow of overdueEscrows) {

            // Safety check:
            // Only release an escrow that is still held.
            if (escrow.status !== "held") {
                continue;
            }


            escrow.status = "released";

            escrow.releasedAt = now;

            escrow.releaseReason =
                "automatic_24h_release";


            await escrow.save();

            releasedCount++;
        }


        return releasedCount;

    } catch (error) {

        console.error(
            "Auto-release service error:",
            error
        );

        throw error;
    }
};


module.exports = {
    releaseOverduePayments
};