import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authAPI";
import { useAuth } from "./authContext";

const LoginForm = () => {

    const navigate = useNavigate(); 

    const { login } = useAuth();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");



    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

                const data = await loginUser(formData);

                login(data);

                navigate("/");


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="min-h-screen flex items-center justify-center px-6">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 border p-8 rounded-3xl"
            >


                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>



                {error && (

                    <div className="bg-red-50 text-red-700 p-3 rounded-xl">

                        {error}

                    </div>

                )}



                <input

                    name="email"

                    type="email"

                    placeholder="Email"

                    value={formData.email}

                    onChange={handleChange}

                    className="w-full border p-3 rounded-xl"

                    required

                />



                <input

                    name="password"

                    type="password"

                    placeholder="Password"

                    value={formData.password}

                    onChange={handleChange}

                    className="w-full border p-3 rounded-xl"

                    required

                />



                <button

                    disabled={loading}

                    className="w-full bg-black text-white py-3 rounded-xl"

                >

                    {loading ? "Logging in..." : "Login"}

                </button>



            </form>


        </div>

    );

};


export default LoginForm;