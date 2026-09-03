import { useEffect, useState } from "react";
import {
    getTasks
} from "../task/taskAPI";
import {
    getBidSummary,
    submitBid
} from "./bidAPI";

const BrowseTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [bidAmounts, setBidAmounts] = useState({});
    const [completionTimes, setCompletionTimes] = useState({});
    const [messages, setMessages] = useState({});
    const [workingTaskId, setWorkingTaskId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadSummary = async (taskId) => {
        try {
            const data = await getBidSummary(taskId);
            setSummaries((current) => ({
                ...current,
                [taskId]: data
            }));

            if (
                data.myBid &&
                bidAmounts[taskId] === undefined
            ) {
                setBidAmounts((current) => ({
                    ...current,
                    [taskId]: data.myBid.amount
                }));
            }
        } catch {
            // Do not break the whole marketplace
            // if one summary request fails.
        }
    };

    const loadTasks = async () => {
        try {
            const data = await getTasks();
            const openTasks = (data.tasks || []).filter(
                (task) => task.status === "open"
            );
            setTasks(openTasks);

            await Promise.all(
                openTasks.map((task) => loadSummary(task._id))
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load open tasks"
            );
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBid = async (taskId) => {
        const amount = Number(bidAmounts[taskId]);

        if (
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            setError("Enter a valid bid amount");
            return;
        }

        try {
            setWorkingTaskId(taskId);
            setError("");
            setSuccess("");

            const data = await submitBid(
                taskId,
                {
                    amount,
                    message: messages[taskId] || "",
                    estimatedCompletionTime:
                        Number(completionTimes[taskId] || 0)
                }
            );

            setSuccess(data.message);
            await loadSummary(taskId);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit bid"
            );
        } finally {
            setWorkingTaskId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div>
                <h1 className="text-3xl font-bold">
                    Browse Open Tasks
                </h1>
                <p className="mt-2 text-gray-600">
                    Submit a competitive bid. If you already bid,
                    your next bid must be lower.
                </p>
            </div>

            {error && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700">
                    {success}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-5 mt-8">
                {tasks.map((task) => {
                    const summary = summaries[task._id];
                    return (
                        <article
                            key={task._id}
                            className="border rounded-3xl p-6"
                        >
                            <div className="flex justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {task.title}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        {task.description}
                                    </p>
                                </div>
                                <span className="text-sm border rounded-full px-3 py-1 h-fit">
                                    open
                                </span>
                            </div>

                            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="border rounded-xl p-3">
                                    <span className="text-gray-500">
                                        Budget
                                    </span>
                                    <p className="font-medium mt-1">
                                        {task.budgetMin} -{" "}
                                        {task.budgetMax} BDT
                                    </p>
                                </div>
                                <div className="border rounded-xl p-3">
                                    <span className="text-gray-500">
                                        Current Lowest Bid
                                    </span>
                                    <p className="font-medium mt-1">
                                        {summary?.lowestBid !== null &&
                                            summary?.lowestBid !== undefined
                                            ? `${summary.lowestBid} BDT`
                                            : "No bids yet"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mt-3">
                                {summary?.bidCount || 0} active bid(s)
                            </p>

                            {summary?.myBid && (
                                <div className="mt-4 p-3 rounded-xl bg-gray-50">
                                    <span className="text-sm text-gray-500">
                                        Your current bid
                                    </span>
                                    <p className="font-semibold mt-1">
                                        {summary.myBid.amount} BDT
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        To bid again, enter a LOWER amount.
                                    </p>
                                </div>
                            )}

                            <div className="mt-5 space-y-3">
                                <input
                                    type="number"
                                    min="1"
                                    value={bidAmounts[task._id] ?? ""}
                                    onChange={(event) =>
                                        setBidAmounts({
                                            ...bidAmounts,
                                            [task._id]: event.target.value
                                        })
                                    }
                                    placeholder="Your bid amount"
                                    className="w-full border rounded-xl p-3"
                                />

                                <textarea
                                    rows="3"
                                    value={messages[task._id] || ""}
                                    onChange={(event) =>
                                        setMessages({
                                            ...messages,
                                            [task._id]: event.target.value
                                        })
                                    }
                                    placeholder="Optional message to the task owner"
                                    className="w-full border rounded-xl p-3"
                                />

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={completionTimes[task._id] ?? ""}
                                    onChange={(event) =>
                                        setCompletionTimes({
                                            ...completionTimes,
                                            [task._id]: event.target.value
                                        })
                                    }
                                    placeholder="Estimated completion (hours)"
                                    className="w-full border rounded-xl p-3"
                                />

                                <button
                                    type="button"
                                    onClick={() => handleBid(task._id)}
                                    disabled={workingTaskId === task._id}
                                    className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
                                >
                                    {workingTaskId === task._id
                                        ? "Submitting..."
                                        : summary?.myBid
                                            ? "Lower My Bid"
                                            : "Submit Bid"}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {tasks.length === 0 && (
                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">
                    No open tasks are currently available.
                </div>
            )}
        </div>
    );
};

export default BrowseTasks;