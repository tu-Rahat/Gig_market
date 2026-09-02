const Escrow = require(
    "../escrow/escrow.model"
);


// ============================================
// Feature 21
// Get transaction history for logged-in user
// ============================================

const getTransactionHistory = async (
    req,
    res
) => {

    try {

        const userId = req.user.id;


        const escrows = await Escrow.find({

            $or: [
                {
                    owner: userId
                },
                {
                    worker: userId
                }
            ]

        })
            .populate(
                "task",
                "title status"
            )
            .populate(
                "owner",
                "name email"
            )
            .populate(
                "worker",
                "name email"
            )
            .sort({
                createdAt: -1
            });


        const transactions =
            escrows.map(
                (escrow) => {

                    const isOwner =
                        escrow.owner._id.toString() ===
                        userId;


                    return {

                        _id:
                            escrow._id,

                        task: {
                            _id:
                                escrow.task?._id,

                            title:
                                escrow.task?.title ||
                                "Task",

                            status:
                                escrow.task?.status ||
                                ""
                        },

                        amount:
                            escrow.amount,

                        currency:
                            escrow.currency,

                        paymentReference:
                            escrow.paymentReference,

                        escrowStatus:
                            escrow.status,

                        role:
                            isOwner
                                ? "customer"
                                : "provider",

                        date:
                            escrow.createdAt,

                        heldAt:
                            escrow.heldAt,

                        releasedAt:
                            escrow.releasedAt,

                        refundedAt:
                            escrow.refundedAt,

                        releaseReason:
                            escrow.releaseReason ||
                            null

                    };

                }
            );


        // ========================================
        // Customer spending
        // ========================================

        const customerTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.role ===
                    "customer"
            );


        const providerTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.role ===
                    "provider"
            );


        // Released customer payments
        const totalSpent =
            customerTransactions
                .filter(
                    (transaction) =>
                        transaction.escrowStatus ===
                        "released"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                );


        // Released provider payments
        const totalEarned =
            providerTransactions
                .filter(
                    (transaction) =>
                        transaction.escrowStatus ===
                        "released"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                );


        const totalRefunded =
            customerTransactions
                .filter(
                    (transaction) =>
                        transaction.escrowStatus ===
                        "refunded"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                );


        return res.status(200).json({

            count:
                transactions.length,

            summary: {

                totalSpent,

                totalEarned,

                totalRefunded

            },

            transactions

        });


    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to load transaction history",

            error:
                error.message

        });

    }

};


module.exports = {

    getTransactionHistory

};     

