import { useEffect, useState } from "react";

import {
    getWorkerAssignments,
    submitCompletedWork
} from "./workSubmissionAPI";


const WorkCompletionCenter = () => {

    const [assignments, setAssignments] =
        useState([]);

    const [selectedEscrowId, setSelectedEscrowId] =
        useState("");

    const [completionNote, setCompletionNote] =
        useState("");

    const [evidence, setEvidence] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    const loadAssignments = async () => {

        try {

            const data =
                await getWorkerAssignments();

            setAssignments(
                data.assignments || []
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load assigned work"
            );

        }

    };


    useEffect(() => {

        loadAssignments();

    }, []);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (!selectedEscrowId) {

            setError(
                "Please select an assigned task"
            );

            return;
        }


        if (!completionNote.trim()) {

            setError(
                "Please describe the completed work"
            );

            return;
        }


        try {

            setLoading(true);


            const data =
                await submitCompletedWork({
                    escrowId:
                        selectedEscrowId,

                    completionNote,

                    evidence
                });


            setMessage(data.message);


            setSelectedEscrowId("");
            setCompletionNote("");
            setEvidence(null);


            event.target.reset();


            await loadAssignments();


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to submit completed work"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            <div className="grid lg:grid-cols-[400px_1fr] gap-8">


                {/* Submission Form */}

                <section className="border rounded-3xl p-6 h-fit">

                    <h1 className="text-2xl font-bold">
                        Submit Completed Work
                    </h1>


                    <p className="mt-2 text-gray-600">

                        Select an assigned task,
                        add a completion note,
                        and optionally upload evidence.

                    </p>


                    {error && (

                        <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700">

                            {error}

                        </div>

                    )}


                    {message && (

                        <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700">

                            {message}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >


                        {/* Assigned Task */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Assigned Task

                            </label>


                            <select
                                value={selectedEscrowId}
                                onChange={(event) =>
                                    setSelectedEscrowId(
                                        event.target.value
                                    )
                                }
                                className="w-full border rounded-xl p-3 bg-white"
                                required
                            >

                                <option value="">
                                    Select a task
                                </option>


                                {assignments.map(
                                    ({ escrow }) => (

                                        <option
                                            key={escrow._id}
                                            value={escrow._id}
                                        >

                                            {
                                                escrow.task?.title ||
                                                "Task"
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        {/* Completion Note */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Completion Note

                            </label>


                            <textarea
                                value={completionNote}
                                onChange={(event) =>
                                    setCompletionNote(
                                        event.target.value
                                    )
                                }
                                rows="6"
                                placeholder="Describe what you completed..."
                                className="w-full border rounded-xl p-3"
                                required
                            />

                        </div>



                        {/* Evidence */}

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Evidence / Proof (optional)

                            </label>


                            <input
                                type="file"
                                onChange={(event) =>
                                    setEvidence(
                                        event.target.files[0] ||
                                        null
                                    )
                                }
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                                className="w-full border rounded-xl p-3"
                            />


                            <p className="text-xs text-gray-500 mt-2">

                                PDF, JPG, PNG, DOC,
                                DOCX, or ZIP.
                                Maximum 10 MB.

                            </p>

                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
                        >

                            {
                                loading
                                    ? "Submitting..."
                                    : "Mark Work Completed"
                            }

                        </button>


                    </form>

                </section>



                {/* Active Assignments */}

                <section>

                    <h2 className="text-2xl font-bold">
                        My Active Assignments
                    </h2>


                    <p className="mt-2 text-gray-600">

                        Tasks currently assigned to you
                        through escrow.

                    </p>


                    <div className="space-y-4 mt-6">


                        {assignments.map(
                            ({
                                escrow,
                                latestSubmission
                            }) => (

                                <article
                                    key={escrow._id}
                                    className="border rounded-2xl p-5"
                                >


                                    <div className="flex flex-col md:flex-row md:justify-between gap-4">


                                        <div>

                                            <h3 className="font-semibold text-lg">

                                                {
                                                    escrow.task?.title ||
                                                    "Task"
                                                }

                                            </h3>


                                            <p className="text-gray-600 mt-1">

                                                Owner:{" "}

                                                {
                                                    escrow.owner?.name
                                                }

                                            </p>


                                            <p className="text-sm text-gray-500 mt-2">

                                                Deadline:{" "}

                                                {
                                                    new Date(
                                                        escrow.completionDeadline
                                                    ).toLocaleString()
                                                }

                                            </p>

                                        </div>



                                        <span className="border rounded-full px-3 py-1 text-sm h-fit w-fit">

                                            {
                                                latestSubmission?.status ||
                                                "not submitted"
                                            }

                                        </span>


                                    </div>



                                    {
                                        latestSubmission?.status ===
                                        "rejected" && (

                                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">

                                                Rejected:{" "}

                                                {
                                                    latestSubmission
                                                        .rejectionReason
                                                }

                                                <br />

                                                You may submit revised work.

                                            </div>

                                        )
                                    }



                                    {
                                        latestSubmission?.status ===
                                        "submitted" && (

                                            <div className="mt-4 text-sm text-amber-700">

                                                Waiting for owner review.

                                            </div>

                                        )
                                    }


                                </article>

                            )
                        )}


                    </div>



                    {
                        assignments.length === 0 && (

                            <div className="mt-6 border border-dashed rounded-2xl p-8 text-center text-gray-500">

                                No active assignments found.

                            </div>

                        )
                    }


                </section>


            </div>

        </div>

    );

};


export default WorkCompletionCenter;