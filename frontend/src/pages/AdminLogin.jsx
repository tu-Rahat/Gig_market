import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    loginAdmin
} from "../features/admin/adminAPI";


const AdminLogin = () => {

    const navigate =
        useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");


        try {

            setLoading(true);


            const data =
                await loginAdmin(
                    email,
                    password
                );


            navigate(
                "/admin"
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Admin login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="max-w-md mx-auto py-16 px-6">

            <div className="border rounded-3xl p-8">

                <h1 className="text-3xl font-bold">
                    Admin Login
                </h1>

                <p className="mt-2 text-gray-600">
                    Gig Market Administration
                </p>


                {error && (

                    <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Admin Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className="w-full border rounded-xl p-3"
                            required
                        />

                    </div>


                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            className="w-full border rounded-xl p-3"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
                    >

                        {
                            loading
                                ? "Signing in..."
                                : "Login as Admin"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

};


export default AdminLogin;