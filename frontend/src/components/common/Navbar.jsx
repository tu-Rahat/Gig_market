import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";


const Navbar = () => {

    const { user, isAuthenticated, logout } = useAuth();


    return (

        <nav className="px-8 py-5 border-b bg-white">

            <div className="max-w-6xl mx-auto flex items-center justify-between">


                {/* Logo */}

                <Link 
                    to="/"
                    className="text-2xl font-bold"
                >
                    Gig Market
                </Link>



                {/* Navigation */}

                <div className="flex items-center gap-4">


                    {
                        isAuthenticated ? (

                            <>

                                <span className="text-gray-700">
                                    Hi, {user?.name}
                                </span>


                                <Link
                                    to="/dashboard"
                                    className="px-5 py-2 rounded-xl border"
                                >
                                    Dashboard
                                </Link>


                                <button

                                    onClick={logout}

                                    className="px-5 py-2 rounded-xl bg-black text-white"

                                >
                                    Logout

                                </button>


                            </>


                        ) : (

                            <>


                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded-xl border"
                                >
                                    Login
                                </Link>



                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded-xl bg-black text-white"
                                >
                                    Get Started
                                </Link>


                            </>

                        )

                    }


                </div>


            </div>


        </nav>

    );

};


export default Navbar;