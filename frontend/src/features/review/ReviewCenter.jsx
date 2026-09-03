import { useEffect, useState } from "react";

import {
    createReview,
    getMyReviewableTasks
} from "./reviewAPI";


const ReviewCenter = () => {

    const [submissions, setSubmissions] =
        useState([]);

    const [drafts, setDrafts] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [submittingId, setSubmittingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [messages, setMessages] =
        useState({});


    const loadReviewableTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyReviewableTasks();

            setSubmissions(
                data.submissions || []
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load reviewable tasks"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadReviewableTasks();

    }, []);


    const updateDraft = (
        submissionId,
        field,
        value
    ) => {

        setDrafts({

            ...drafts,

            [submissionId]: {

                ...drafts[submissionId],

                [field]: value

            }

        });

    };


    const handleSubmit = async (
        submission
    ) => {

        const draft =
            drafts[submission._id] || {};

        const rating =
            Number(draft.rating || 5);

        const comment =
            draft.comment || "";


        try {

            setSubmittingId(
                submission._id
            );

            setError("");

            const data =
                await createReview(
                    submission.task._id,
                    rating,
                    comment
                );


            setMessages({

                ...messages,

                [submission._id]:
                    data.message ||
                    "Review submitted successfully"

            });


            setSubmissions(
                submissions.filter(
                    item =>
                        item._id !==
                        submission._id
                )
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to submit review"
            );

        } finally {

            setSubmittingId(null);

        }

    };


    if (loading) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">

                <h1 className="text-3xl font-bold">
                    Ratings & Reviews
                </h1>

                <p className="mt-3 text-gray-600">
                    Loading reviewable services...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">

            <h1 className="text-3xl font-bold">
                Ratings & Reviews
            </h1>

            <p className="mt-2 text-gray-600">
                Rate and review providers after
                the work has been approved or
                rejected.
            </p>


            {error && (

                <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>

            )}


            <div className="space-y-5 mt-8">

                {submissions.map(
                    (submission) => (

                        <article
                            key={submission._id}
                            className="border rounded-3xl p-6"
                        >

                            <div className="flex flex-col md:flex-row md:justify-between gap-5">

                                <div>

                                    <h2 className="text-xl font-semibold">

                                        {submission.task?.title ||
                                            "Task"}

                                    </h2>

                                    <p className="mt-2 text-gray-600">

                                        Provider:{" "}

                                        {submission.worker?.name ||
                                            "Provider"}

                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">

                                        Work decision:{" "}

                                        <span className="font-medium capitalize">

                                            {submission.status}

                                        </span>

                                    </p>

                                </div>


                                <div className="border rounded-full px-4 py-2 h-fit text-sm">

                                    {submission.status ===
                                    "approved"
                                        ? "Approved"
                                        : "Rejected"}

                                </div>

                            </div>


                            <div className="mt-6">

                                <label className="block text-sm font-medium mb-2">
                                    Rating
                                </label>

                                <select
                                    value={
                                        drafts[
                                            submission._id
                                        ]?.rating || 5
                                    }
                                    onChange={(event) =>
                                        updateDraft(
                                            submission._id,
                                            "rating",
                                            event.target.value
                                        )
                                    }
                                    className="w-full border rounded-xl p-3"
                                >

                                    <option value="5">
                                        5 — Excellent
                                    </option>

                                    <option value="4">
                                        4 — Very Good
                                    </option>

                                    <option value="3">
                                        3 — Good
                                    </option>

                                    <option value="2">
                                        2 — Poor
                                    </option>

                                    <option value="1">
                                        1 — Very Poor
                                    </option>

                                </select>

                            </div>


                            <div className="mt-4">

                                <label className="block text-sm font-medium mb-2">
                                    Written Review
                                </label>

                                <textarea
                                    value={
                                        drafts[
                                            submission._id
                                        ]?.comment || ""
                                    }
                                    onChange={(event) =>
                                        updateDraft(
                                            submission._id,
                                            "comment",
                                            event.target.value
                                        )
                                    }
                                    rows="4"
                                    placeholder="Write your review..."
                                    className="w-full border rounded-xl p-3"
                                />

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    handleSubmit(
                                        submission
                                    )
                                }
                                disabled={
                                    submittingId ===
                                    submission._id
                                }
                                className="w-full bg-black text-white py-3 rounded-xl mt-4 disabled:opacity-60"
                            >

                                {submittingId ===
                                submission._id
                                    ? "Submitting..."
                                    : "Submit Review"}

                            </button>

                        </article>

                    )
                )}

            </div>


            {submissions.length === 0 && (

                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                    No services are currently
                    waiting for your rating or
                    review.

                </div>

            )}

        </div>

    );

};


export default ReviewCenter;