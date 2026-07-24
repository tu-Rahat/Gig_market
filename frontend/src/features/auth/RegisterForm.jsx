import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./authAPI";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await registerUser(formData);

            setSuccess(
                data.message || "Account created successfully."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 border p-8 rounded-3xl"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Create Account
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Join Gig Market and start finding opportunities.
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;