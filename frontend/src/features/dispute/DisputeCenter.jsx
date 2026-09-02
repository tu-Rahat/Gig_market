import {
    useEffect,
    useState
} from "react";

import {
    createDispute,
    getMyDisputes,
    getMyEscrowsForDispute
} from "./disputeAPI";


const DisputeCenter = () => {

    const [
        escrows,
        setEscrows
    ] = useState([]);

    const [
        disputes,
        setDisputes
    ] = useState([]);

    const [
        formData,
        setFormData
    ] = useState({
        escrowId: "",
        reason: "",
        description: ""
    });

    const [
        evidence,
        setEvidence
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        loadingData,
        setLoadingData
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        message,
        setMessage
    ] = useState("");


    // =================================================
    // Load data
    // =================================================

    const loadData = async () => {

        try {

            setLoadingData(true);
            setError("");

            const [
                escrowData,
                disputeData
            ] = await Promise.all([
                getMyEscrowsForDispute(),
                getMyDisputes()
            ]);


            // Only allow payments that can
            // potentially be disputed
            const availableEscrows =
                (escrowData.escrows || [])
                    .filter(
                        (escrow) =>
                            escrow.status === "held"
                    );


            setEscrows(
                availableEscrows
            );


            setDisputes(
                disputeData.disputes || []
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load dispute data"
            );

        } finally {

            setLoadingData(false);

        }

    };


    useEffect(() => {

        loadData();

    }, []);


    // =================================================
    // Input change
    // =================================================

    const handleChange = (
        event
    ) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });

    };


    // =================================================
    // Evidence change
    // =================================================

    const handleEvidenceChange = (
        event
    ) => {

        const files =
            Array.from(
                event.target.files || []
            );

        setEvidence(
            files.slice(0, 5)
        );

    };


    // =================================================
    // Submit dispute
    // =================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (!formData.escrowId) {

            setError(
                "Please select a payment"
            );

            return;

        }


        try {

            setLoading(true);


            const data =
                await createDispute({
                    ...formData,
                    evidence
                });


            setMessage(
                data.message ||
                "Dispute raised successfully"
            );


            setFormData({
                escrowId: "",
                reason: "",
                description: ""
            });


            setEvidence([]);


            // Reload everything
            await loadData();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to raise dispute"
            );

        } finally {

            setLoading(false);

        }

    };


    if (loadingData) {

        return (
            <div className="max-w-6xl mx-auto px-6 py-12">

                <p className="text-gray-600">
                    Loading dispute center...
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            {/* =========================================
                Header
            ========================================= */}

            <div>

                <h1 className="text-3xl font-bold">
                    Dispute Management
                </h1>

                <p className="mt-2 text-gray-600">
                    Raise disputes, submit evidence,
                    and track dispute decisions.
                </p>

            </div>


            {/* =========================================
                Messages
            ========================================= */}

            {error && (

                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700">

                    {error}

                </div>

            )}


            {message && (

                <div className="mt-6 p-4 rounded-xl bg-green-50 text-green-700">

                    {message}

                </div>

            )}


            {/* =========================================
                Raise dispute
            ========================================= */}

            <section className="mt-8 border rounded-3xl p-6">

                <h2 className="text-2xl font-bold">
                    Raise a Dispute
                </h2>

                <p className="mt-2 text-gray-600">
                    Select an active payment and
                    explain the problem.
                </p>


                {escrows.length === 0 ? (

                    <div className="mt-6 border border-dashed rounded-2xl p-6 text-gray-600">

                        No held payments are currently
                        available for a new dispute.

                    </div>

                ) : (

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >

                        {/* Payment */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Payment / Escrow

                            </label>

                            <select
                                name="escrowId"
                                value={
                                    formData.escrowId
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-xl p-3 bg-white"
                                required
                            >

                                <option value="">
                                    Select payment
                                </option>

                                {escrows.map(
                                    (escrow) => (

                                        <option
                                            key={
                                                escrow._id
                                            }
                                            value={
                                                escrow._id
                                            }
                                        >

                                            {escrow.task?.title ||
                                                "Task"}{" "}
                                            —{" "}
                                            {escrow.amount}{" "}
                                            {escrow.currency}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Reason */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Reason

                            </label>

                            <input
                                type="text"
                                name="reason"
                                value={
                                    formData.reason
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Work incomplete"
                                maxLength={150}
                                className="w-full border rounded-xl p-3"
                                required
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Description

                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Explain the issue in detail..."
                                rows={5}
                                maxLength={3000}
                                className="w-full border rounded-xl p-3 resize-none"
                                required
                            />

                        </div>


                        {/* Evidence */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Supporting Evidence

                            </label>

                            <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                onChange={
                                    handleEvidenceChange
                                }
                                className="w-full border rounded-xl p-3"
                            />

                            <p className="text-sm text-gray-500 mt-2">

                                Up to 5 files.
                                JPG, PNG, WEBP or PDF.
                                Maximum 10 MB per file.

                            </p>


                            {evidence.length > 0 && (

                                <div className="mt-3 space-y-2">

                                    {evidence.map(
                                        (file, index) => (

                                            <div
                                                key={index}
                                                className="text-sm border rounded-xl p-3"
                                            >

                                                {file.name}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-60"
                        >

                            {loading
                                ? "Submitting..."
                                : "Raise Dispute"}

                        </button>

                    </form>

                )}

            </section>


            {/* =========================================
                My disputes
            ========================================= */}

            <section className="mt-10">

                <h2 className="text-2xl font-bold">
                    My Disputes
                </h2>

                <p className="mt-2 text-gray-600">
                    View disputes involving you.
                </p>


                <div className="space-y-5 mt-6">

                    {disputes.map(
                        (dispute) => (

                            <article
                                key={
                                    dispute._id
                                }
                                className="border rounded-3xl p-6"
                            >

                                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                    <div>

                                        <h3 className="text-xl font-semibold">

                                            {dispute.task?.title ||
                                                "Task"}

                                        </h3>

                                        <p className="text-gray-600 mt-2">

                                            Payment:{" "}

                                            <span className="font-semibold text-black">

                                                {dispute.escrow?.amount}{" "}
                                                {dispute.escrow?.currency}

                                            </span>

                                        </p>

                                    </div>


                                    <span className="border rounded-full px-4 py-2 text-sm h-fit">

                                        {dispute.status}

                                    </span>

                                </div>


                                <div className="mt-5 grid md:grid-cols-2 gap-4">

                                    <div className="border rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Reason
                                        </p>

                                        <p className="font-medium mt-1">
                                            {dispute.reason}
                                        </p>

                                    </div>


                                    <div className="border rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Raised By
                                        </p>

                                        <p className="font-medium mt-1">

                                            {dispute.raisedBy?.name ||
                                                "Unknown"}

                                        </p>

                                    </div>

                                </div>


                                <div className="mt-4 border rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Description
                                    </p>

                                    <p className="mt-2">
                                        {dispute.description}
                                    </p>

                                </div>


                                {dispute.adminDecision && (

                                    <div className="mt-4 bg-gray-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Admin Decision
                                        </p>

                                        <p className="font-medium mt-1">

                                            {dispute.adminDecision}

                                        </p>


                                        {dispute.adminNote && (

                                            <p className="text-sm mt-2">

                                                {dispute.adminNote}

                                            </p>

                                        )}

                                    </div>

                                )}

                            </article>

                        )
                    )}

                </div>


                {disputes.length === 0 && (

                    <div className="mt-6 border border-dashed rounded-2xl p-8 text-center text-gray-500">

                        No disputes yet.

                    </div>

                )}

            </section>

        </div>

    );

};


export default DisputeCenter;