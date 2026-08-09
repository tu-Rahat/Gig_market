import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getTaskCountdown } from "./countdownAPI";


const calculateRemaining = (deadlineValue) => {
    const deadline = new Date(deadlineValue);
    const now = new Date();

    const remainingMs = Math.max(
        deadline.getTime() - now.getTime(),
        0
    );

    const totalSeconds = Math.floor(
        remainingMs / 1000
    );

    return {
        expired: remainingMs === 0,

        days: Math.floor(
            totalSeconds / 86400
        ),

        hours: Math.floor(
            (totalSeconds % 86400) / 3600
        ),

        minutes: Math.floor(
            (totalSeconds % 3600) / 60
        ),

        seconds:
            totalSeconds % 60
    };
};


const TaskCountdown = () => {

    const [searchParams] = useSearchParams();

    const escrowId =
        searchParams.get("escrowId");


    const [
        countdownData,
        setCountdownData
    ] = useState(null);


    const [
        remaining,
        setRemaining
    ] = useState(null);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadCountdown = async () => {

            if (!escrowId) {

                setError(
                    "No escrow record was selected"
                );

                setLoading(false);

                return;
            }


            try {

                const data =
                    await getTaskCountdown(
                        escrowId
                    );


                setCountdownData(data);


                setRemaining(
                    calculateRemaining(
                        data.completionDeadline
                    )
                );


            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load countdown"
                );

            } finally {

                setLoading(false);

            }

        };


        loadCountdown();


    }, [escrowId]);


    useEffect(() => {

        if (
            !countdownData?.completionDeadline
        ) {
            return;
        }


        const intervalId =
            setInterval(() => {

                setRemaining(
                    calculateRemaining(
                        countdownData
                            .completionDeadline
                    )
                );

            }, 1000);


        return () => {

            clearInterval(intervalId);

        };


    }, [countdownData]);


    if (loading) {

        return (

            <div className="max-w-4xl mx-auto px-6 py-12">

                Loading countdown...

            </div>

        );

    }


    if (error) {

        return (

            <div className="max-w-4xl mx-auto px-6 py-12">

                <div className="bg-red-50 text-red-700 p-4 rounded-xl">

                    {error}

                </div>

            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto px-6 py-12">


            <Link
                to="/payments/escrow"
                className="text-sm text-gray-600"
            >
                ← Back to Escrow
            </Link>


            <div className="border rounded-3xl p-8 mt-6">


                <p className="text-gray-500">

                    Task Countdown

                </p>


                <h1 className="text-3xl font-bold mt-2">

                    {
                        countdownData?.task
                            ?.title ||
                        "Active Task"
                    }

                </h1>


                <p className="mt-3 text-gray-600">

                    Deadline:{" "}

                    {
                        new Date(
                            countdownData
                                .completionDeadline
                        ).toLocaleString()
                    }

                </p>


                {
                    remaining?.expired ? (

                        <div className="mt-8 p-6 rounded-2xl bg-red-50 text-red-700 text-center">

                            Task completion time
                            has expired.

                        </div>

                    ) : (

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">


                            <div className="bg-black text-white rounded-2xl p-5 text-center">

                                <div className="text-4xl font-bold">

                                    {
                                        remaining?.days
                                        ?? 0
                                    }

                                </div>

                                <div className="text-sm text-gray-300 mt-1">

                                    Days

                                </div>

                            </div>


                            <div className="bg-black text-white rounded-2xl p-5 text-center">

                                <div className="text-4xl font-bold">

                                    {
                                        remaining?.hours
                                        ?? 0
                                    }

                                </div>

                                <div className="text-sm text-gray-300 mt-1">

                                    Hours

                                </div>

                            </div>


                            <div className="bg-black text-white rounded-2xl p-5 text-center">

                                <div className="text-4xl font-bold">

                                    {
                                        remaining?.minutes
                                        ?? 0
                                    }

                                </div>

                                <div className="text-sm text-gray-300 mt-1">

                                    Minutes

                                </div>

                            </div>


                            <div className="bg-black text-white rounded-2xl p-5 text-center">

                                <div className="text-4xl font-bold">

                                    {
                                        remaining?.seconds
                                        ?? 0
                                    }

                                </div>

                                <div className="text-sm text-gray-300 mt-1">

                                    Seconds

                                </div>

                            </div>


                        </div>

                    )
                }


                <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm">


                    <div className="border rounded-xl p-4">

                        <span className="text-gray-500">

                            Escrow Status

                        </span>

                        <p className="font-medium mt-1">

                            {
                                countdownData
                                    ?.status
                            }

                        </p>

                    </div>


                    <div className="border rounded-xl p-4">

                        <span className="text-gray-500">

                            Owner

                        </span>

                        <p className="font-medium mt-1">

                            {
                                countdownData
                                    ?.owner
                                    ?.name
                            }

                        </p>

                    </div>


                    <div className="border rounded-xl p-4">

                        <span className="text-gray-500">

                            Worker

                        </span>

                        <p className="font-medium mt-1">

                            {
                                countdownData
                                    ?.worker
                                    ?.name
                            }

                        </p>

                    </div>


                </div>


            </div>


        </div>

    );

};


export default TaskCountdown;