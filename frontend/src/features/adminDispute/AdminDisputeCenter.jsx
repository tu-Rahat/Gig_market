import {
    useEffect,
    useState
} from "react";

import {
    getPendingDisputes,
    resolveDispute
} from "./adminDisputeAPI";


const AdminDisputeCenter = () => {

    const [
        disputes,
        setDisputes
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        resolvingId,
        setResolvingId
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const [
        message,
        setMessage
    ] = useState("");

    const [
        decisions,
        setDecisions
    ] = useState({});

    const [
        notes,
        setNotes
    ] = useState({});


    // ============================================
    // Load pending disputes
    // ============================================

    const loadDisputes = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getPendingDisputes();

            setDisputes(
                data.disputes || []
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load pending disputes"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDisputes();

    }, []);


    // ============================================
    // Decision change
    // ============================================

    const handleDecisionChange = (
        disputeId,
        value
    ) => {

        setDecisions({
            ...decisions,
            [disputeId]: value
        });

    };


    // ============================================
    // Note change
    // ============================================

    const handleNoteChange = (
        disputeId,
        value
    ) => {

        setNotes({
            ...notes,
            [disputeId]: value
        });

    };


    // ============================================
    // Resolve
    // ============================================

    const handleResolve = async (
        disputeId
    ) => {

        const decision =
            decisions[disputeId];

        const adminNote =
            notes[disputeId] || "";


        if (!decision) {

            setError(
                "Select a decision before resolving the dispute"
            );

            return;

        }


        try {

            setResolvingId(
                disputeId
            );

            setError("");
            setMessage("");


            const data =
                await resolveDispute(
                    disputeId,
                    decision,
                    adminNote
                );


            setMessage(
                data.message ||
                "Dispute resolved successfully"
            );


            await loadDisputes();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to resolve dispute"
            );

        } finally {

            setResolvingId("");

        }

    };


    // ============================================
    // Loading
    // ============================================

    if (loading) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">

                <h1 className="text-3xl font-bold">
                    Dispute Review
                </h1>

                <p className="mt-3 text-gray-600">
                    Loading pending disputes...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">
                    Dispute Review
                </h1>

                <p className="mt-2 text-gray-600">
                    Review customer and worker disputes
                    and make final decisions.
                </p>

            </div>


            {/* Error */}

            {error && (

                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700">

                    {error}

                </div>

            )}


            {/* Success */}

            {message && (

                <div className="mt-6 p-4 rounded-xl bg-green-50 text-green-700">

                    {message}

                </div>

            )}


            {/* =====================================
                Disputes
            ===================================== */}

            <div className="space-y-6 mt-8">

                {disputes.map(
                    (dispute) => (

                        <article
                            key={
                                dispute._id
                            }
                            className="border rounded-3xl p-6"
                        >

                            {/* Top */}

                            <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {dispute.task?.title ||
                                            "Disputed Task"}

                                    </h2>

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


                            {/* Parties */}

                            <div className="grid md:grid-cols-2 gap-4 mt-6">

                                <div className="border rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Customer / Owner
                                    </p>

                                    <p className="font-medium mt-1">

                                        {dispute.owner?.name ||
                                            "Unknown"}

                                    </p>

                                    {dispute.owner?.email && (

                                        <p className="text-sm text-gray-500 mt-1">

                                            {dispute.owner.email}

                                        </p>

                                    )}

                                </div>


                                <div className="border rounded-xl p-4">

                                    <p className="text-sm text-gray-500">
                                        Worker / Provider
                                    </p>

                                    <p className="font-medium mt-1">

                                        {dispute.worker?.name ||
                                            "Unknown"}

                                    </p>

                                    {dispute.worker?.email && (

                                        <p className="text-sm text-gray-500 mt-1">

                                            {dispute.worker.email}

                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* Raised by */}

                            <div className="border rounded-xl p-4 mt-4">

                                <p className="text-sm text-gray-500">
                                    Raised By
                                </p>

                                <p className="font-medium mt-1">

                                    {dispute.raisedBy?.name ||
                                        "Unknown"}

                                </p>

                            </div>


                            {/* Reason */}

                            <div className="border rounded-xl p-4 mt-4">

                                <p className="text-sm text-gray-500">
                                    Reason
                                </p>

                                <p className="font-medium mt-1">

                                    {dispute.reason}

                                </p>

                            </div>


                            {/* Description */}

                            <div className="border rounded-xl p-4 mt-4">

                                <p className="text-sm text-gray-500">
                                    Description
                                </p>

                                <p className="mt-2 whitespace-pre-wrap">

                                    {dispute.description}

                                </p>

                            </div>


                            {/* Evidence */}

                            {dispute.evidence?.length > 0 && (

                                <div className="border rounded-xl p-4 mt-4">

                                    <p className="text-sm text-gray-500">
                                        Supporting Evidence
                                    </p>


                                    <div className="space-y-2 mt-3">

                                        {dispute.evidence.map(
                                            (
                                                file,
                                                index
                                            ) => (

                                                <div
                                                    key={
                                                        file._id ||
                                                        index
                                                    }
                                                    className="border rounded-lg p-3 text-sm"
                                                >

                                                    {file.originalName ||
                                                        file.filename ||
                                                        "Evidence file"}

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}


                            {/* Admin decision */}

                            <div className="mt-6 border-t pt-6">

                                <h3 className="font-semibold">
                                    Admin Decision
                                </h3>


                                <div className="mt-4">

                                    <label className="block text-sm font-medium mb-2">

                                        Decision

                                    </label>

                                    <select
                                        value={
                                            decisions[
                                                dispute._id
                                            ] || ""
                                        }
                                        onChange={
                                            (event) =>
                                                handleDecisionChange(
                                                    dispute._id,
                                                    event.target.value
                                                )
                                        }
                                        className="w-full border rounded-xl p-3 bg-white"
                                    >

                                            <option value="">
                                                Select decision
                                            </option>

                                            <option value="owner_favor">
                                                Customer / Owner Favor
                                            </option>

                                            <option value="worker_favor">
                                                Worker / Provider Favor
                                            </option>

                                            <option value="partial_resolution">
                                                Partial Resolution
                                            </option>

                                            <option value="no_violation">
                                                No Violation
                                            </option>

                                    </select>

                                </div>


                                <div className="mt-4">

                                    <label className="block text-sm font-medium mb-2">

                                        Admin Note

                                    </label>

                                    <textarea
                                        value={
                                            notes[
                                                dispute._id
                                            ] || ""
                                        }
                                        onChange={
                                            (event) =>
                                                handleNoteChange(
                                                    dispute._id,
                                                    event.target.value
                                                )
                                        }
                                        rows={4}
                                        placeholder="Explain the reason for your decision..."
                                        className="w-full border rounded-xl p-3 resize-none"
                                    />

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleResolve(
                                            dispute._id
                                        )
                                    }
                                    disabled={
                                        resolvingId ===
                                        dispute._id
                                    }
                                    className="mt-4 bg-black text-white px-6 py-3 rounded-xl disabled:opacity-60"
                                >

                                    {resolvingId ===
                                    dispute._id
                                        ? "Resolving..."
                                        : "Resolve Dispute"}

                                </button>

                            </div>

                        </article>

                    )
                )}

            </div>


            {/* Empty */}

            {disputes.length === 0 && (

                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                    No pending disputes.

                </div>

            )}

        </div>

    );

};


export default AdminDisputeCenter;