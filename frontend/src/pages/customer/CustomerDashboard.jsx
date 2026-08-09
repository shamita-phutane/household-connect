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
import { getSubscriptionsByUser } from "../../api/userSubscriptionApi";

function statusClass(status) {
    switch (status) {
        case "COMPLETED":
            return "completed";
        case "PENDING":
            return "pending";
        case "ACCEPTED":
            return "accepted";
        case "CANCELLED":
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

                setActivePlan(active || null);

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
                            <div style={{marginTop: '10px', fontSize: '0.95rem'}}>
                                <strong>{activePlan.planName} Plan</strong> - Active<br/>
                                <span style={{color: 'var(--text-secondary)'}}>Discount: {activePlan.discount}% OFF</span><br/>
                                <span style={{color: 'var(--text-secondary)'}}>Expires: {activePlan.endDate}</span><br/>
                                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                                    {activePlan.description && activePlan.description.split(',').map((perk, index) => (
                                        <li key={index} style={{ color: 'var(--primary)' }}>{perk.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <span style={{marginTop: '10px'}}>None</span>
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

                    <button onClick={() => navigate("/#plans")}>

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