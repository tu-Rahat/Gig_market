// Link import removed (not used)
import { useAuth } from "../features/auth/authContext";

import {
    dashboardSections
} from "../features/dashboard/dashboardItems";

import DashboardSection
    from "../features/dashboard/DashboardSection";


const Dashboard = () => {

    const { user } = useAuth();


    return (

        <div className="min-h-screen bg-gray-50">


            <div className="max-w-7xl mx-auto px-6 py-12">


                {/* Dashboard Header */}

                <div
                    className="
                        bg-black
                        text-white
                        rounded-3xl
                        p-8
                        md:p-10
                    "
                >

                    <p className="text-gray-400">
                        Gig Market Dashboard
                    </p>


                    <h1
                        className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            mt-2
                        "
                    >

                        Welcome, {user?.name || "User"}

                    </h1>


                    <p
                        className="
                            mt-4
                            text-gray-300
                            max-w-2xl
                        "
                    >

                        Post jobs, find work, build your
                        professional reputation, and manage
                        payments from one place.

                    </p>

                </div>



                {/* Quick Actions */}

                <div className="mt-8">

                    <h2 className="text-xl font-bold">
                        Quick Actions
                    </h2>


                    <div
                        className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-4
                            mt-5
                        "
                    >


                        <a
                            href="/tasks/create"
                            className="
                                bg-white
                                border
                                rounded-2xl
                                p-5
                                hover:shadow-md
                                transition
                            "
                        >

                            <h3 className="font-semibold">
                                Post a Task
                            </h3>

                            <p className="text-sm text-gray-600 mt-2">
                                Create a new job advertisement.
                            </p>

                        </a>


                        <a
                            href="/tasks/browse"
                            className="
                                bg-white
                                border
                                rounded-2xl
                                p-5
                                hover:shadow-md
                                transition
                            "
                        >

                            <h3 className="font-semibold">
                                Find Work
                            </h3>

                            <p className="text-sm text-gray-600 mt-2">
                                Browse available opportunities.
                            </p>

                        </a>


                        <a
                            href="/credentials"
                            className="
                                bg-white
                                border
                                rounded-2xl
                                p-5
                                hover:shadow-md
                                transition
                            "
                        >

                            <h3 className="font-semibold">
                                My Credentials
                            </h3>

                            <p className="text-sm text-gray-600 mt-2">
                                Manage your professional documents.
                            </p>

                        </a>


                    </div>

                </div>



                {/* Complete Feature List */}

                {dashboardSections.map((section) => (

                    <DashboardSection
                        key={section.title}
                        title={section.title}
                        description={section.description}
                        features={section.features}
                    />

                ))}


            </div>

        </div>

    );

};


export default Dashboard;