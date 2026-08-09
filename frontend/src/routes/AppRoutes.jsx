import FeaturePlaceholder
    from "../pages/FeaturePlaceholder";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CategoryManagement from "../pages/CategoryManagement";
import CreateTask from "../pages/CreateTask";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Escrow from "../pages/Escrow";
import TaskCountdown from "../pages/TaskCountdown";
import WorkCompletion from "../pages/WorkCompletion";
import OwnerApproval from "../pages/OwnerApproval";
import Credentials from "../pages/Credentials";



const AppRoutes = () => {

    return (

        <Routes>

            <Route element={<PublicLayout />}>

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

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
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
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/tasks/browse"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

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
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/workers/filter"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile/professional"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/reviews"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/badges"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/bidders/compare"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

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

<Route
    path="/payments/auto-release"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/disputes"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/transactions"
    element={
        <ProtectedRoute>
            <FeaturePlaceholder />
        </ProtectedRoute>
    }
/>

<Route
    path="/credentials"
    element={
        <ProtectedRoute>
            <Credentials />
        </ProtectedRoute>
    }
/>

            </Route>

        </Routes>

    );

};


export default AppRoutes;