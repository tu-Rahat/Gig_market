import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getPendingCredentials,
    approveCredential,
    rejectCredential,
    logoutAdmin
} from "../features/admin/adminAPI";


const AdminDashboard = () => {

    const navigate =
        useNavigate();


    const [credentials, setCredentials] =
        useState([]);

    const [reasons, setReasons] =
        useState({});

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [workingId, setWorkingId] =
        useState(null);


    const loadCredentials =
        async () => {

            try {

                setError("");

                const data =
                    await getPendingCredentials();


                setCredentials(
                    data.credentials || []
                );

            } catch (err) {

                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {

                    navigate(
                        "/admin/login"
                    );

                    return;
                }


                setError(
                    err.response?.data?.message ||
                    "Failed to load pending credentials"
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadCredentials();

    }, []);


    const handleApprove =
        async (
            credentialId
        ) => {

            try {

                setWorkingId(
                    credentialId
                );

                setError("");
                setMessage("");


                const data =
                    await approveCredential(
                        credentialId
                    );


                setMessage(
                    data.message
                );


                await loadCredentials();

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to verify credential"
                );

            } finally {

                setWorkingId(null);

            }

        };


    const handleReject =
        async (
            credentialId
        ) => {

            const reason =
                reasons[
                    credentialId
                ]?.trim();


            if (!reason) {

                setError(
                    "Enter a rejection reason"
                );

                return;
            }


            try {

                setWorkingId(
                    credentialId
                );

                setError("");
                setMessage("");


                const data =
                    await rejectCredential(
                        credentialId,
                        reason
                    );


                setMessage(
                    data.message
                );


                setReasons({
                    ...reasons,
                    [credentialId]: ""
                });


                await loadCredentials();

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to reject credential"
                );

            } finally {

                setWorkingId(null);

            }

        };


    const handleLogout = async () => {
        await logoutAdmin().catch(() => {});
        navigate(
            "/admin/login"
        );

    };


    if (loading) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">
                Loading admin panel...
            </div>

        );

    }


    return (

        <div className="max-w-6xl mx-auto px-6 py-12">


            <div className="flex justify-between items-start gap-4">

                <div>

                    <h1 className="text-3xl font-bold">
                        Admin Panel
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Credential Verification
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleLogout}
                    className="border px-4 py-2 rounded-xl"
                >
                    Admin Logout
                </button>

            </div>


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

            <div className="mt-8 border rounded-3xl p-6">

    <div className="flex justify-between items-center gap-4">

        <div>
            <h2 className="text-xl font-bold">
                Dispute Management
            </h2>

            <p className="mt-2 text-gray-600">
                Review customer and provider disputes.
            </p>
        </div>

        <span className="border rounded-full px-3 py-1 text-sm">
            Feature 20
        </span>

    </div>

    <button
        type="button"
        onClick={() =>
            navigate("/admin/disputes")
        }
        className="mt-5 bg-black text-white px-5 py-3 rounded-xl"
    >
        Review Disputes →
    </button>

</div>
            <div className="space-y-5 mt-8">


                {credentials.map(
                    (
                        credential
                    ) => (

                        <article
                            key={
                                credential._id
                            }
                            className="border rounded-3xl p-6"
                        >


                            <h2 className="text-xl font-semibold">
                                {
                                    credential.title
                                }
                            </h2>


                            <p className="mt-2 text-gray-600">

                                Worker:{" "}

                                {
                                    credential.owner?.name ||
                                    "Unknown"
                                }

                            </p>


                            <p className="mt-1 text-sm text-gray-500">

                                Email:{" "}

                                {
                                    credential.owner?.email ||
                                    "-"
                                }

                            </p>


                            <p className="mt-3">

                                Type:{" "}

                                <strong>
                                    {
                                        credential.credentialType
                                    }
                                </strong>

                            </p>


                            <p className="mt-2">

                                Status:{" "}

                                <strong>
                                    {
                                        credential.verificationStatus
                                    }
                                </strong>

                            </p>


                            <p className="mt-2 text-sm text-gray-500">

                                File:{" "}

                                {
                                    credential.document
                                        ?.originalName ||
                                    "No filename"
                                }

                            </p>


                            <div className="grid md:grid-cols-2 gap-4 mt-6">


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleApprove(
                                            credential._id
                                        )
                                    }
                                    disabled={
                                        workingId ===
                                        credential._id
                                    }
                                    className="bg-black text-white py-3 rounded-xl disabled:opacity-60"
                                >

                                    Verify Credential

                                </button>


                                <div>

                                    <textarea
                                        value={
                                            reasons[
                                                credential._id
                                            ] || ""
                                        }
                                        onChange={
                                            (
                                                event
                                            ) =>
                                                setReasons({
                                                    ...reasons,

                                                    [
                                                        credential._id
                                                    ]:
                                                        event.target.value
                                                })
                                        }
                                        placeholder="Reason for rejection..."
                                        rows="3"
                                        className="w-full border rounded-xl p-3"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleReject(
                                                credential._id
                                            )
                                        }
                                        disabled={
                                            workingId ===
                                            credential._id
                                        }
                                        className="w-full border border-black py-3 rounded-xl mt-2 disabled:opacity-60"
                                    >

                                        Reject Credential

                                    </button>

                                </div>


                            </div>


                        </article>

                    )
                )}


            </div>


            {
                credentials.length === 0 &&
                (

                    <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">

                        No credential requests
                        are waiting for review.

                    </div>

                )
            }


        </div>

    );

};


export default AdminDashboard;