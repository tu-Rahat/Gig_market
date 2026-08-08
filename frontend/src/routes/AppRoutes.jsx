import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CategoryManagement from "../pages/CategoryManagement";
import CreateTask from "../pages/CreateTask";
import ProtectedRoute from "../features/auth/ProtectedRoute";


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

            </Route>

        </Routes>

    );

};


export default AppRoutes;