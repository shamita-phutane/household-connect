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
import BookService from "../pages/customer/BookService";
import MyBookings from "../pages/customer/MyBookings";
import Payments from "../pages/customer/Payments";
import BookingConfirmation from "../pages/customer/BookingConfirmation";

import PartnerDashboard from "../pages/partner/PartnerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {

    return (

        <Routes>

            {/* ---------- PUBLIC ---------- */}

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

            {/* ---------- CUSTOMER ---------- */}

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
                    path="/customer/book-service"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <BookService />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/bookings"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/bookings/:bookingId"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <BookingConfirmation />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/payments/:bookingId"
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                            <Payments />
                        </ProtectedRoute>
                    }
                />

            </Route>

            {/* ---------- PARTNER ---------- */}

            <Route element={<DashboardLayout />}>

                <Route
                    path="/partner/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["PARTNER"]}>
                            <PartnerDashboard />
                        </ProtectedRoute>
                    }
                />

            </Route>

            {/* ---------- ADMIN ---------- */}

            <Route element={<DashboardLayout />}>

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Route>

            {/* ---------- 404 ---------- */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default AppRoutes;
