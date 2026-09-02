import { useEffect, useState } from "react";
import {
    getMyEscrows,
    releaseEscrowPayment
} from "./escrowAPI";

const AutoReleaseStatus = () => {

    const [escrows, setEscrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [releasingId, setReleasingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadEscrows = async () => {
        try {

            setLoading(true);
            setError("");

            const data = await getMyEscrows();

            setEscrows(data.escrows || []);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load payment status"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadEscrows();
    }, []);


    const handleRelease = async (escrowId) => {

        try {

            setReleasingId(escrowId);
            setError("");
            setMessage("");

            const data =
                await releaseEscrowPayment(
                    escrowId
                );

            setMessage(
                data.message ||
                "Payment released successfully"
            );

            await loadEscrows();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to release payment"
            );

        } finally {

            setReleasingId("");

        }
    };


    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleString();

    };


    const getTimeRemaining = (deadline) => {

        if (!deadline) {
            return null;
        }

        const difference =
            new Date(deadline).getTime() -
            new Date().getTime();

        if (difference <= 0) {
            return "Automatic release is due";
        }

        const hours =
            Math.floor(
                difference /
                (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );

        return `${hours}h ${minutes}m remaining`;

    };


    if (loading) {

        return (
            <div className="max-w-6xl mx-auto px-6 py-12">

                <h1 className="text-3xl font-bold">
                    Auto-Release Status
                </h1>

                <p className="mt-4 text-gray-600">
                    Loading payment status...
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            <div>

                <h1 className="text-3xl font-bold">
                    Auto-Release Status
                </h1>

                <p className="mt-2 text-gray-600">
                    Track escrow payments and the
                    24-hour automatic release window.
                </p>

            </div>


            {error && (

                <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>

            )}


            {message && (

                <div className="mt-5 p-4 rounded-xl bg-green-50 text-green-700">
                    {message}
                </div>

            )}


            <div className="grid gap-5 mt-8">

                {escrows.map((escrow) => {

                    const isHeld =
                        escrow.status === "held";

                    const hasDeadline =
                        Boolean(
                            escrow.approvalDeadline
                        );

                    const canRelease =
                        isHeld &&
                        hasDeadline;

                    return (

                        <article
                            key={escrow._id}
                            className="border rounded-3xl p-6"
                        >

                            <div className="flex flex-col md:flex-row md:justify-between gap-5">

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        {escrow.task?.title ||
                                            "Task"}
                                    </h2>

                                    <p className="mt-2 text-gray-600">
                                        Payment:{" "}
                                        <span className="font-semibold text-black">
                                            {escrow.amount}{" "}
                                            {escrow.currency}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Reference:{" "}
                                        {escrow.paymentReference}
                                    </p>

                                </div>


                                <span className="border rounded-full px-3 py-1 text-sm h-fit w-fit">
                                    {escrow.status}
                                </span>

                            </div>


                            <div className="grid md:grid-cols-2 gap-4 mt-6">

                                <div className="border rounded-2xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Completion Deadline
                                    </p>

                                    <p className="font-medium mt-1">
                                        {formatDate(
                                            escrow.completionDeadline
                                        )}
                                    </p>

                                </div>


                                <div className="border rounded-2xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Customer Response Deadline
                                    </p>

                                    <p className="font-medium mt-1">
                                        {formatDate(
                                            escrow.approvalDeadline
                                        )}
                                    </p>

                                </div>

                            </div>


                            {hasDeadline && isHeld && (

                                <div className="mt-5 p-4 rounded-2xl bg-amber-50">

                                    <p className="font-medium text-amber-900">
                                        24-Hour Auto-Release Window
                                    </p>

                                    <p className="text-sm text-amber-800 mt-1">
                                        {getTimeRemaining(
                                            escrow.approvalDeadline
                                        )}
                                    </p>

                                </div>

                            )}


                            {escrow.status === "released" && (

                                <div className="mt-5 p-4 rounded-2xl bg-green-50">

                                    <p className="font-medium text-green-900">
                                        Payment Released
                                    </p>

                                    <p className="text-sm text-green-800 mt-1">
                                        Released At:{" "}
                                        {formatDate(
                                            escrow.releasedAt
                                        )}
                                    </p>

                                    {escrow.releaseReason && (

                                        <p className="text-sm text-green-800 mt-1">
                                            Reason:{" "}
                                            {escrow.releaseReason ===
                                            "automatic_24h_release"
                                                ? "Automatic 24-Hour Release"
                                                : "Customer Approved"}
                                        </p>

                                    )}

                                </div>

                            )}


                            {canRelease && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRelease(
                                            escrow._id
                                        )
                                    }
                                    disabled={
                                        releasingId ===
                                        escrow._id
                                    }
                                    className="mt-5 bg-black text-white px-5 py-3 rounded-xl disabled:opacity-60"
                                >

                                    {releasingId ===
                                    escrow._id
                                        ? "Releasing..."
                                        : "Release Payment"}

                                </button>

                            )}

                        </article>

                    );

                })}

            </div>


            {escrows.length === 0 && (

                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                    No escrow payment records found.

                </div>

            )}

        </div>

    );
};

export default AutoReleaseStatus;