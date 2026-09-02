import {
    useEffect,
    useState
} from "react";

import {
    getTransactionHistory
} from "./transactionAPI";


const TransactionCenter = () => {

    const [transactions, setTransactions] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalSpent: 0,
            totalEarned: 0,
            totalRefunded: 0
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadTransactions = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTransactionHistory();

            setTransactions(
                data.transactions || []
            );

            setSummary(
                data.summary || {
                    totalSpent: 0,
                    totalEarned: 0,
                    totalRefunded: 0
                }
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load transaction history"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadTransactions();

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleString();

    };


    const getStatusLabel = (status) => {

        switch (status) {

            case "released":
                return "Released";

            case "refunded":
                return "Refunded";

            case "held":
                return "Held";

            case "disputed":
                return "Disputed";

            default:
                return status;

        }

    };


    if (loading) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">

                <h1 className="text-3xl font-bold">
                    Transactions
                </h1>

                <p className="mt-3 text-gray-600">
                    Loading transaction history...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            {/* =====================================
                Header
            ===================================== */}

            <div>

                <h1 className="text-3xl font-bold">
                    Transactions & Spending
                </h1>

                <p className="mt-2 text-gray-600">
                    Track your payments, spending,
                    earnings and refunds.
                </p>

            </div>


            {/* =====================================
                Error
            ===================================== */}

            {error && (

                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700">

                    {error}

                </div>

            )}


            {/* =====================================
                Summary Cards
            ===================================== */}

            <div className="grid md:grid-cols-3 gap-5 mt-8">

                {/* Total Spent */}

                <div className="border rounded-3xl p-6">

                    <p className="text-sm text-gray-500">
                        Total Spent
                    </p>

                    <p className="text-3xl font-bold mt-2">

                        {summary.totalSpent} BDT

                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Released customer payments
                    </p>

                </div>


                {/* Total Earned */}

                <div className="border rounded-3xl p-6">

                    <p className="text-sm text-gray-500">
                        Total Earned
                    </p>

                    <p className="text-3xl font-bold mt-2">

                        {summary.totalEarned} BDT

                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Released provider payments
                    </p>

                </div>


                {/* Total Refunded */}

                <div className="border rounded-3xl p-6">

                    <p className="text-sm text-gray-500">
                        Total Refunded
                    </p>

                    <p className="text-3xl font-bold mt-2">

                        {summary.totalRefunded} BDT

                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Customer payments returned
                    </p>

                </div>

            </div>


            {/* =====================================
                Transaction History
            ===================================== */}

            <section className="mt-10">

                <div className="flex justify-between items-center gap-4">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Transaction History
                        </h2>

                        <p className="mt-1 text-gray-600">
                            Complete payment and booking history.
                        </p>

                    </div>

                    <span className="border rounded-full px-4 py-2 text-sm">
                        {transactions.length} transactions
                    </span>

                </div>


                <div className="space-y-4 mt-6">

                    {transactions.map(
                        (transaction) => (

                            <article
                                key={
                                    transaction._id
                                }
                                className="border rounded-3xl p-6"
                            >

                                {/* Top section */}

                                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                    <div>

                                        <h3 className="text-xl font-semibold">

                                            {transaction.task?.title ||
                                                "Task"}

                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">

                                            {transaction.role ===
                                            "customer"
                                                ? "Customer payment"
                                                : "Provider earning"}

                                        </p>

                                    </div>


                                    <div className="text-left md:text-right">

                                        <p className="text-xl font-bold">

                                            {transaction.amount}{" "}
                                            {transaction.currency}

                                        </p>

                                        <span className="inline-block border rounded-full px-3 py-1 text-sm mt-2">

                                            {getStatusLabel(
                                                transaction.escrowStatus
                                            )}

                                        </span>

                                    </div>

                                </div>


                                {/* Details */}

                                <div className="grid md:grid-cols-2 gap-4 mt-5">

                                    <div className="border rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Payment Reference
                                        </p>

                                        <p className="font-medium mt-1 break-all">

                                            {transaction.paymentReference ||
                                                "-"}

                                        </p>

                                    </div>


                                    <div className="border rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Date
                                        </p>

                                        <p className="font-medium mt-1">

                                            {formatDate(
                                                transaction.date
                                            )}

                                        </p>

                                    </div>

                                </div>


                                {/* Role */}

                                <div className="mt-4">

                                    <p className="text-sm text-gray-500">
                                        Your Role
                                    </p>

                                    <p className="font-medium mt-1 capitalize">

                                        {transaction.role}

                                    </p>

                                </div>


                                {/* Refund */}

                                {transaction.refundedAt && (

                                    <div className="mt-4 bg-gray-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Refunded At
                                        </p>

                                        <p className="font-medium mt-1">

                                            {formatDate(
                                                transaction.refundedAt
                                            )}

                                        </p>

                                    </div>

                                )}


                                {/* Release */}

                                {transaction.releasedAt && (

                                    <div className="mt-4 bg-gray-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Released At
                                        </p>

                                        <p className="font-medium mt-1">

                                            {formatDate(
                                                transaction.releasedAt
                                            )}

                                        </p>

                                    </div>

                                )}

                            </article>

                        )
                    )}

                </div>


                {/* Empty */}

                {transactions.length === 0 && (

                    <div className="mt-6 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                        No transactions found.

                    </div>

                )}

            </section>

        </div>

    );

};


export default TransactionCenter;