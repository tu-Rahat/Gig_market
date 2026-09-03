import { useEffect, useState } from "react";
import { selectProvider, getTaskQuotes } from "../features/bid/bidAPI";

const QuoteComparison = ({ taskId }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectingBidId, setSelectingBidId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadQuotes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getTaskQuotes(taskId);
            setTaskTitle(data.taskTitle || "");
            setQuotes(data.quotes || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load quotations"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadQuotes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    const handleSelectProvider = async (bidId) => {
        try {
            setSelectingBidId(bidId);
            setError("");
            setMessage("");
            const data = await selectProvider(taskId, bidId);
            setMessage(data.message);
            await loadQuotes();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to select provider"
            );
        } finally {
            setSelectingBidId(null);
        }
    };

    if (loading) {
        return <div className="max-w-6xl mx-auto px-6 py-12">Loading quotations...</div>;
    }

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold">Compare Quotations</h1>
            {taskTitle && <p className="mt-2 text-gray-600">{taskTitle}</p>}

            {error && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>
            )}
            {message && (
                <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700">
                    {message}
                </div>
            )}

            <div className="space-y-5 mt-8">
                {quotes.map((quote) => {
                    const isSelected = quote.bid.status === "selected";
                    return (
                        <article
                            key={quote.bid._id}
                            className="border rounded-3xl p-6"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between gap-5">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {quote.provider.name}
                                    </h2>
                                    <div className="mt-3 text-gray-700 space-y-1">
                                        <p>Price: <strong>{quote.bid.amount} BDT</strong></p>
                                        <p>Rating: {quote.provider.rating?.average ?? 0}</p>
                                        <p>Experience: {quote.provider.experience || "Not provided"}</p>
                                        <p>Completed Jobs: {quote.provider.completedJobs ?? 0}</p>
                                        <p>Estimated Completion: {quote.bid.estimatedCompletionTime ?? 0} hours</p>
                                    </div>
                                    {quote.bid.message && (
                                        <p className="mt-4 text-gray-600">{quote.bid.message}</p>
                                    )}
                                </div>
                                <div className="flex items-start gap-3">
                                    {isSelected ? (
                                        <span className="border rounded-xl px-4 py-2">Selected Provider</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectProvider(quote.bid._id)}
                                            disabled={selectingBidId !== null}
                                            className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
                                        >
                                            {selectingBidId === quote.bid._id ?
                                                "Selecting..." : "Select Provider"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {quotes.length === 0 && (
                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">
                    No quotations submitted yet.
                </div>
            )}
        </main>
    );
};

export default QuoteComparison;
