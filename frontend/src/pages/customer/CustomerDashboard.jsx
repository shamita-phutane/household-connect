import "./CustomerDashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaCalendarCheck,
    FaClipboardList,
    FaPiggyBank,
    FaCrown,
    FaArrowRight
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { getCustomerBookings } from "../../api/bookingApi";
import { getSubscriptionsByUser, cancelSubscription } from "../../api/userSubscriptionApi";

function statusClass(status) {
    switch (status) {
        case "COMPLETED":
            return "completed";
        case "PENDING":
            return "pending";
        case "ACCEPTED":
            return "accepted";
        case "CANCELLED":
        case "REJECTED":
            return "cancelled";
        default:
            return "";
    }
}

function bookingStatusLabel(status) {
    switch (status) {
        case "PENDING": return "Awaiting Confirmation";
        case "ACCEPTED": return "Confirmed";
        case "COMPLETED": return "Completed";
        case "CANCELLED": return "Cancelled";
        case "REJECTED": return "Rejected";
        default: return status;
    }
}

function CustomerDashboard() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [activePlan, setActivePlan] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        async function loadDashboard() {

            try {

                const [bookingData, subscriptionData] = await Promise.all([

                    getCustomerBookings(user.userId),

                    getSubscriptionsByUser(user.userId)

                ]);

                setBookings(bookingData);

                const active = subscriptionData.find(
                    subscription => subscription.status === "ACTIVE"
                );

                const exhausted = subscriptionData.find(
                    subscription => subscription.status === "EXHAUSTED"
                );

                setActivePlan(active || exhausted || null);

            }

            catch (err) {

                console.error(err);

                setError("Unable to load your dashboard right now.");

            }

            finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, [user.userId]);

    async function handleCancelSubscription(subId) {
        if (window.confirm("Are you sure you want to cancel your subscription? No refund will be provided and you will lose access to all remaining perks.")) {
            try {
                await cancelSubscription(subId);
                const subscriptionData = await getSubscriptionsByUser(user.userId);
                const active = subscriptionData.find(s => s.status === "ACTIVE");
                const exhausted = subscriptionData.find(s => s.status === "EXHAUSTED");
                setActivePlan(active || exhausted || null);
                alert("Subscription cancelled successfully.");
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || "Failed to cancel subscription.");
            }
        }
    }

    if (loading) {

        return (

            <div className="customer-dashboard">

                <div className="container">

                    <h2>Loading dashboard...</h2>

                </div>

            </div>

        );

    }

    if (error) {

        return (

            <div className="customer-dashboard">

                <div className="container">

                    <h2>{error}</h2>

                </div>

            </div>

        );

    }

    const upcomingCount = bookings.filter(
        booking =>
            booking.status === "PENDING" ||
            booking.status === "ACCEPTED"
    ).length;

    const totalSaved = bookings.reduce(
        (sum, booking) => sum + (booking.discountAmount || 0),
        0
    );

    const recentBookings = [...bookings]
        .sort((a, b) => {

            if (a.date === b.date) {
                return 0;
            }

            return a.date < b.date ? 1 : -1;

        })
        .slice(0, 3);

    return (

        <div className="customer-dashboard">

            <div className="container">

                <div className="dashboard-header">

                    <div>

                        <span className="dashboard-tag">

                            Customer Dashboard

                        </span>

                        <h1>

                            Welcome back, {user.name?.split(" ")[0]} 👋

                        </h1>

                        <p>

                            Manage your bookings, payments and membership from one place.

                        </p>

                    </div>

                </div>

                <div className="stats-grid">

                    <div className="dashboard-card">

                        <FaCalendarCheck className="card-icon"/>

                        <h3>

                            Upcoming Bookings

                        </h3>

                        <span>

                            {upcomingCount}

                        </span>

                    </div>

                    <div className="dashboard-card">

                        <FaClipboardList className="card-icon"/>

                        <h3>

                            Total Bookings

                        </h3>

                        <span>

                            {bookings.length}

                        </span>

                    </div>

                    <div className="dashboard-card">

                        <FaPiggyBank className="card-icon"/>

                        <h3>

                            Total Saved

                        </h3>

                        <span>

                            ₹{totalSaved.toFixed(0)}

                        </span>

                    </div>

                    <div className="dashboard-card" style={{gridColumn: activePlan ? "1 / -1" : "auto", display: 'flex', flexDirection: 'column', gap: '5px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <FaCrown className="card-icon"/>
                            <h3 style={{margin: 0}}>My Subscription</h3>
                        </div>
                        {activePlan ? (
                            <div style={{marginTop: '15px'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>{activePlan.planName} Plan</strong>
                                        <span className={`badge ${activePlan.status === "EXHAUSTED" ? 'cancelled' : 'completed'}`} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '12px', fontWeight: 'bold' }}>
                                            {activePlan.status}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleCancelSubscription(activePlan.subId)}
                                        style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                                    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Remaining Uses</span>
                                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{activePlan.remainingUses ?? 0}</strong>
                                    </div>
                                    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Discount</span>
                                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{activePlan.discount}% OFF</strong>
                                    </div>
                                    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Started On</span>
                                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{activePlan.startDate}</strong>
                                    </div>
                                    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Expires On</span>
                                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{activePlan.endDate}</strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span style={{marginTop: '10px', color: 'var(--text-secondary)'}}>None</span>
                        )}
                    </div>

                </div>

                <h2 className="section-heading">

                    Quick Actions

                </h2>

                <div className="actions-grid">

                    <button onClick={() => navigate("/customer/book-service")}>

                        Book a Service

                        <FaArrowRight/>

                    </button>

                    <button onClick={() => navigate("/customer/bookings")}>

                        My Bookings

                        <FaArrowRight/>

                    </button>

                    <button onClick={() => navigate("/plans")}>

                        View Plans

                        <FaArrowRight/>

                    </button>

                </div>

                <h2 className="section-heading">

                    Recent Bookings

                </h2>

                {

                    recentBookings.length === 0

                        ?

                        <div className="recent-bookings">

                            <div className="empty-state">

                                You haven't made any bookings yet.

                            </div>

                        </div>

                        :

                        <div className="recent-bookings">

                            {

                                recentBookings.map(booking => (

                                    <div

                                        key={booking.bookingId}
                                        className="booking-row"

                                    >

                                        <span>

                                            {booking.serviceName}

                                        </span>

                                        <span className={statusClass(booking.status)}>
                                            {bookingStatusLabel(booking.status)}
                                        </span>

                                        <strong>

                                            ₹{booking.finalAmount}

                                        </strong>

                                    </div>

                                ))

                            }

                        </div>

                }

            </div>

        </div>

    );

}

export default CustomerDashboard;