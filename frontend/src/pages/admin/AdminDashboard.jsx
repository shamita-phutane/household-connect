import "../customer/CustomerDashboard.css";
import "../customer/MyBookings.css";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { getAllUsers } from "../../api/userApi";
import { getAllBookings } from "../../api/bookingApi";
import { getAllPayments } from "../../api/paymentApi";
import { getAllServices } from "../../api/servicesApi";

import AdminOverview from "./components/AdminOverview";
import UserManagement from "./components/UserManagement";
import PartnerManagement from "./components/PartnerManagement";
import BookingsOverview from "./components/BookingsOverview";
import ServicesManagement from "./components/ServicesManagement";
import PaymentsOverview from "./components/PaymentsOverview";
import ReviewsOverview from "./components/ReviewsOverview";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("OVERVIEW");
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);

    async function loadData() {
        setLoading(true);
        try {
            const [u, b, p, s, r] = await Promise.all([
                getAllUsers(),
                getAllBookings(),
                getAllPayments(),
                getAllServices(),
                import("../../api/reviewApi").then(m => m.getAllReviews())
            ]);
            setUsers(u);
            setBookings(b);
            setPayments(p);
            setServices(s);
            setReviews(r);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load admin data. Ensure you have proper permissions.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function refreshUsers() {
        setUsers(await getAllUsers());
    }

    async function refreshServices() {
        setServices(await getAllServices());
    }

    async function refreshReviews() {
        const { getAllReviews } = await import("../../api/reviewApi");
        setReviews(await getAllReviews());
    }

    if (loading) {
        return <div className="customer-dashboard"><div className="container"><h2>Loading Admin Dashboard...</h2></div></div>;
    }

    if (error) {
        return <div className="customer-dashboard"><div className="container"><h2>{error}</h2></div></div>;
    }

    const tabs = [
        { id: "OVERVIEW", label: "Overview" },
        { id: "USERS", label: "Users" },
        { id: "PARTNERS", label: "Partners" },
        { id: "BOOKINGS", label: "Bookings" },
        { id: "SERVICES", label: "Services" },
        { id: "PAYMENTS", label: "Payments" },
        { id: "REVIEWS", label: "Reviews" },
    ];

    return (
        <div className="customer-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <span className="dashboard-tag">Admin Dashboard</span>
                        <h1>Welcome back, {user.name?.split(" ")[0]} 👋</h1>
                        <p>Manage all users, bookings, services, and payments across the platform.</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className="pay-btn" 
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                background: activeTab === tab.id ? "var(--accent-color)" : "var(--surface)", 
                                color: activeTab === tab.id ? "#000" : "var(--text-primary)",
                                border: "1px solid var(--border)",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "OVERVIEW" && <AdminOverview users={users} bookings={bookings} payments={payments} />}
                {activeTab === "USERS" && <UserManagement users={users} refreshUsers={refreshUsers} />}
                {activeTab === "PARTNERS" && <PartnerManagement users={users} />}
                {activeTab === "BOOKINGS" && <BookingsOverview bookings={bookings} />}
                {activeTab === "SERVICES" && <ServicesManagement services={services} refreshServices={refreshServices} />}
                {activeTab === "PAYMENTS" && <PaymentsOverview payments={payments} />}
                {activeTab === "REVIEWS" && <ReviewsOverview reviews={reviews} bookings={bookings} refreshReviews={refreshReviews} />}
                
            </div>
        </div>
    );
}