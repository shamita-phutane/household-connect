import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import NotFound from "../pages/public/NotFound";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import PartnerDashboard from "../pages/partner/PartnerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {

    return (

        <Routes>

            <Route element={<PublicLayout />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

            </Route>

            <Route element={<DashboardLayout />}>

                <Route
                    path="/customer/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/partner/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["PARTNER"]}>
                            <PartnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default AppRoutes;