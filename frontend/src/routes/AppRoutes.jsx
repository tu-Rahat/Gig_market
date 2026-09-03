import {
    Routes,
    Route,
    Navigate,
    useParams
} from "react-router-dom";
import AdminLogin from
    "../pages/AdminLogin";
import AdminDisputes from "../pages/AdminDisputes";
import AdminDashboard from
    "../pages/AdminDashboard";
import FeaturePlaceholder from "../pages/FeaturePlaceholder";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import CategoryManagement from "../pages/CategoryManagement";
import CreateTask from "../pages/CreateTask";

import Escrow from "../pages/Escrow";
import TaskCountdown from "../pages/TaskCountdown";
import WorkCompletion from "../pages/WorkCompletion";
import OwnerApproval from "../pages/OwnerApproval";
import AutoReleaseStatus from "../pages/AutoReleaseStatus";
import Disputes from "../pages/Disputes";
import Transactions from "../pages/Transactions";

import MyAdvertisements from "../pages/MyAdvertisements";
import BrowseTasks from "../pages/BrowseTasks";

import Credentials from "../pages/Credentials";
import CredentialBidderFilter from "../features/bidderFilter/CredentialBidderFilter";
import ProfessionalProfile from "../features/workerProfile/ProfessionalProfile";
import WorkerProfile from "../features/workerProfile/WorkerProfileView";
import Reviews from "../pages/Reviews";
import BidderComparison from "../pages/BidderComparison";
import NearbyProviders from "../pages/NearbyProviders";
import QuoteComparison from "../pages/QuoteComparison";
import SelectionHistory from "../pages/SelectionHistory";

import ProtectedRoute from "../features/auth/ProtectedRoute";

const QuoteComparisonPage = () => {
    const { taskId } = useParams();
    return <QuoteComparison taskId={taskId} />;
};

const AppRoutes = () => {

    return (

        <Routes>

            <Route element={<PublicLayout />}>

                {/* Public Routes */}
                <Route
                    path="/admin/login"
                    element={
                        <AdminLogin />
                    }
                />


                <Route
                    path="/admin"
                    element={
                        <AdminDashboard />
                    }
                />

                <Route
                    path="/admin/disputes"
                    element={
                        <AdminDisputes />
                    }
                />

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Member 1 */}

                <Route
                    path="/categories/manage"
                    element={
                        <ProtectedRoute>
                            <CategoryManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/create"
                    element={
                        <ProtectedRoute>
                            <CreateTask />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/mine"
                    element={
                        <ProtectedRoute>
                            <MyAdvertisements />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/browse"
                    element={
                        <ProtectedRoute>
                            <BrowseTasks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/providers/nearby"
                    element={
                        <ProtectedRoute>
                            <NearbyProviders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/:taskId/quotes"
                    element={
                        <ProtectedRoute>
                            <QuoteComparisonPage />
                        </ProtectedRoute>
                    }
                />


                {/* Future Member 1 Features */}

                <Route
                    path="/bids/ranking"
                    element={
                        <ProtectedRoute>
                            <FeaturePlaceholder />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bids/expiration"
                    element={
                        <ProtectedRoute>
                            <FeaturePlaceholder />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workers/select"
                    element={
                        <ProtectedRoute>
                            <SelectionHistory />
                        </ProtectedRoute>
                    }
                />


                {/* Member 2 */}

                <Route
                    path="/credentials"
                    element={
                        <ProtectedRoute>
                            <Credentials />
                        </ProtectedRoute>
                    }
                />


                {/* Future Member 2 Features */}

                {/* <Route
                    path="/workers/filter"
                    element={
                        <ProtectedRoute>
                            <FeaturePlaceholder />
                        </ProtectedRoute>
                    }
                /> */}

                {/* <Route
                    path="/profile/professional"
                    element={
                        <ProtectedRoute>
                            <FeaturePlaceholder />
                        </ProtectedRoute>
                    }
                /> */}

                <Route
                    path="/reviews"
                    element={
                        <ProtectedRoute>
                            <Reviews />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/badges"
                    element={
                        <ProtectedRoute>
                            <Navigate to="/profile/professional" replace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bidders/compare"
                    element={
                        <ProtectedRoute>
                            <BidderComparison />
                        </ProtectedRoute>
                    }
                />


                {/* Member 3 */}

                <Route
                    path="/payments/escrow"
                    element={
                        <ProtectedRoute>
                            <Escrow />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/countdown"
                    element={
                        <ProtectedRoute>
                            <TaskCountdown />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/completion"
                    element={
                        <ProtectedRoute>
                            <WorkCompletion />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/approval"
                    element={
                        <ProtectedRoute>
                            <OwnerApproval />
                        </ProtectedRoute>
                    }
                />


                {/* Future Member 3 Features */}

                <Route
                    path="/payments/auto-release"
                    element={
                        <ProtectedRoute>
                            <AutoReleaseStatus />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/disputes"
                    element={
                        <ProtectedRoute>
                            <Disputes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workers/filter"
                    element={
                        <ProtectedRoute>
                            <CredentialBidderFilter />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile/professional"
                    element={
                        <ProtectedRoute>
                            <ProfessionalProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workers/:userId/profile"
                    element={
                        <WorkerProfile />
                    }
                />

            </Route>
        </Routes>
        
        

    );

};


export default AppRoutes;