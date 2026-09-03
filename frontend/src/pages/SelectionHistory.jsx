import { useEffect, useState } from "react";
import { getMySelectionHistory } from "../features/task/taskAPI";

const SelectionHistory = () => {
    const [selections, setSelections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadHistory = async () => {
            try {
                const data = await getMySelectionHistory();
                if (active) {
                    setSelections(data.selections || []);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load provider selection history"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto px-6 py-12">
                Loading selection history...
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <div>
                <h1 className="text-3xl font-bold">Worker Selection History</h1>
                <p className="mt-2 text-gray-600">
                    Review the providers selected for your completed bookings.
                </p>
            </div>

            {error && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {!error && selections.length > 0 && (
                <div className="mt-8 overflow-x-auto border rounded-3xl">
                    <table className="w-full min-w-[760px] text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Task</th>
                                <th className="p-4 font-semibold">Selected Provider</th>
                                <th className="p-4 font-semibold">Selected Quote</th>
                                <th className="p-4 font-semibold">Booking</th>
                                <th className="p-4 font-semibold">Selected On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selections.map(({ task, selectedBid }) => (
                                <tr key={task._id} className="border-b last:border-b-0">
                                    <td className="p-4 align-top">
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {task.location}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {task.category?.name || "Uncategorized"}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="font-semibold">
                                            {task.selectedWorker?.name || "Provider unavailable"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Rating: {task.selectedWorker?.rating?.average ?? 0}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Completed jobs: {task.selectedWorker?.completedJobs ?? 0}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        {selectedBid ? (
                                            <>
                                                <p className="font-semibold">{selectedBid.amount} BDT</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {selectedBid.estimatedCompletionTime ?? 0} hours
                                                </p>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-500">Quote unavailable</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className="inline-block border rounded-full px-3 py-1 text-sm">
                                            {task.bookingStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top text-sm text-gray-500">
                                        {new Date(task.updatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!error && selections.length === 0 && (
                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">
                    You have not selected a provider for any task yet.
                </div>
            )}
        </main>
    );
};

export default SelectionHistory;
