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

                    <div className="dashboard-card">

                        <FaCrown className="card-icon"/>

                        <h3>

                            Membership

                        </h3>

                        <span>

                            {activePlan ? activePlan.planName : "None"}

                        </span>

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

                                            {booking.status}

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