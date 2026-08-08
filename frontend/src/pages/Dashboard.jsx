import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold">
                Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
                Manage your Gig Market activities.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-10">

                <Link
                    to="/categories/manage"
                    className="border rounded-2xl p-6 hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold">
                        Manage Categories
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Create and manage gig categories.
                    </p>
                </Link>

                <Link
                    to="/tasks/create"
                    className="border rounded-2xl p-6 hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold">
                        Post a Task
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Create a new job advertisement.
                    </p>
                </Link>

            </div>
        </div>
    );
};

export default Dashboard;