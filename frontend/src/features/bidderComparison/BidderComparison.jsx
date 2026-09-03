import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyTasks } from "../task/taskAPI";

import {
    getComparisonBidders
} from "./bidderComparisonAPI";


const BidderComparison = () => {

    const [tasks, setTasks] =
        useState([]);

    const [taskId, setTaskId] =
        useState("");

    const [results, setResults] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [tasksLoading, setTasksLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadTasks = async () => {

            try {

                const data =
                    await getMyTasks();

                setTasks(
                    data.tasks || []
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load your tasks"
                );

            } finally {

                setTasksLoading(false);

            }

        };

        loadTasks();

    }, []);


    const handleCompare = async (
        event
    ) => {

        event.preventDefault();

        if (!taskId) {

            setError(
                "Select a task first"
            );

            return;

        }

        try {

            setLoading(true);
            setError("");

            const data =
                await getComparisonBidders(
                    taskId
                );

            setResults(data);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load bidders"
            );

            setResults([]);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="max-w-7xl mx-auto px-6 py-12">

            <div>

                <h1 className="text-3xl font-bold">
                    Compare Bidders
                </h1>

                <p className="mt-2 text-gray-600">
                    Compare bidders by bid amount,
                    rating, experience and verified
                    credentials.
                </p>

            </div>


            {error && (

                <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>

            )}


            <form
                onSubmit={handleCompare}
                className="mt-8 border rounded-3xl p-5 flex flex-col md:flex-row gap-4"
            >

                <select
                    value={taskId}
                    onChange={(event) =>
                        setTaskId(
                            event.target.value
                        )
                    }
                    disabled={tasksLoading}
                    className="flex-1 border rounded-xl p-3 bg-white"
                    required
                >

                    <option value="">
                        {tasksLoading
                            ? "Loading tasks..."
                            : "Select your task"}
                    </option>

                    {tasks.map((task) => (

                        <option
                            key={task._id}
                            value={task._id}
                        >
                            {task.title}
                        </option>

                    ))}

                </select>


                <button
                    type="submit"
                    disabled={
                        loading ||
                        tasksLoading
                    }
                    className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-60"
                >

                    {loading
                        ? "Loading..."
                        : "Compare Bidders"}

                </button>

            </form>


            {results.length > 0 && (

                <div className="mt-8 border rounded-3xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b">

                                    <th className="p-5">
                                        Bidder
                                    </th>

                                    <th className="p-5">
                                        Bid Amount
                                    </th>

                                    <th className="p-5">
                                        Rating
                                    </th>

                                    <th className="p-5">
                                        Experience
                                    </th>

                                    <th className="p-5">
                                        Credentials
                                    </th>

                                    <th className="p-5">
                                        Profile
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {results.map(
                                    ({
                                        bid,
                                        profileData
                                    }) => {

                                        const profile =
                                            profileData?.profile ||
                                            {};

                                        const user =
                                            profileData?.user ||
                                            {};

                                        const rating =
                                            user.rating?.average ??
                                            profileData?.rating?.average ??
                                            0;

                                        const experienceCount =
                                            (
                                                profile.experience ||
                                                []
                                            ).length;

                                        const credentials =
                                            profileData?.verifiedCredentials ||
                                            [];

                                        return (

                                            <tr
                                                key={bid._id}
                                                className="border-b last:border-b-0"
                                            >

                                                <td className="p-5">

                                                    <p className="font-semibold">
                                                        {bid.bidder?.name ||
                                                            "Unknown bidder"}
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {bid.bidder?.email ||
                                                            ""}
                                                    </p>

                                                </td>


                                                <td className="p-5">

                                                    <span className="font-semibold">
                                                        {bid.amount} BDT
                                                    </span>

                                                </td>


                                                <td className="p-5">

                                                    <span className="font-semibold">
                                                        {Number(
                                                            rating
                                                        ).toFixed(1)}
                                                    </span>

                                                    <span className="ml-1">
                                                        ★
                                                    </span>

                                                </td>


                                                <td className="p-5">

                                                    <span className="font-medium">
                                                        {experienceCount}
                                                    </span>

                                                    <span className="text-gray-500 ml-1">
                                                        {experienceCount ===
                                                        1
                                                            ? "entry"
                                                            : "entries"}
                                                    </span>

                                                </td>


                                                <td className="p-5">

                                                    <span className="font-medium">
                                                        {credentials.length}
                                                    </span>

                                                    <span className="text-gray-500 ml-1">
                                                        verified
                                                    </span>

                                                </td>


                                                <td className="p-5">

                                                    <Link
                                                        to={`/workers/${bid.bidder._id}/profile`}
                                                        className="inline-block border px-4 py-2 rounded-xl text-sm"
                                                    >
                                                        View Profile
                                                    </Link>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}


            {!loading &&
                taskId &&
                results.length === 0 && (

                    <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                        No active bidders found
                        for this task.

                    </div>

                )}


        </div>

    );

};


export default BidderComparison;