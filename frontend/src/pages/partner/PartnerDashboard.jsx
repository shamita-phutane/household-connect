import "../customer/CustomerDashboard.css";
import "../customer/MyBookings.css";

import { useEffect, useState } from "react";
import { FaCalendarCheck, FaClipboardList, FaPiggyBank, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getPartnerBookings, updateBookingStatus } from "../../api/bookingApi";
import { getAllReviews } from "../../api/reviewApi";

function statusClass(status) {
    switch (status) {
        case "COMPLETED": return "completed";
        case "PENDING": return "pending";
        case "ACCEPTED": return "accepted";
        case "CANCELLED": return "cancelled";
        default: return "";
    }
}

function PartnerDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [data, reviewData] = await Promise.all([
                    getPartnerBookings(user.userId),
                    getAllReviews()
                ]);
                // sort by date descending
                const sorted = [...data].sort((a, b) => {
                    if (a.date === b.date) return 0;
                    return a.date < b.date ? 1 : -1;
                });
                setBookings(sorted);
                setReviews(reviewData);
            } catch (err) {
                console.error(err);
                setError("Unable to load partner dashboard right now.");
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, [user.userId]);

    async function handleStatusUpdate(bookingId, newStatus) {
        try {
            await updateBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert("Failed to update booking status. Please try again.");
        }
    }

    if (loading) {
        return (
            <div className="customer-dashboard">
                <div className="container"><h2>Loading dashboard...</h2></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-dashboard">
                <div className="container"><h2>{error}</h2></div>
            </div>
        );
    }

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;
    const pendingBookings = bookings.filter(b => b.status === "PENDING" || b.status === "ACCEPTED").length;
    
    // Earnings from SUCCESS payments (Partner gets 80%)
    const totalEarnings = bookings
        .filter(b => b.paymentStatus === "SUCCESS")
        .reduce((sum, b) => sum + (b.finalAmount || 0), 0) * 0.8;

    // Filter reviews to only those matching partner's bookings
    const partnerReviews = reviews.filter(r => bookings.some(b => b.bookingId === r.bookingId));

    return (
        <div className="customer-dashboard">
            <div className="container">
                
                <div className="dashboard-header">
                    <div>
                        <span className="dashboard-tag">Partner Dashboard</span>
                        <h1>Welcome back, {user.name?.split(" ")[0]} 👋</h1>
                        <p>Manage your assigned bookings and track your earnings.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="dashboard-card">
                        <FaClipboardList className="card-icon"/>
                        <h3>Total Bookings</h3>
                        <span>{totalBookings}</span>
                    </div>
                    <div className="dashboard-card">
                        <FaCalendarCheck className="card-icon"/>
                        <h3>Completed</h3>
                        <span>{completedBookings}</span>
                    </div>
                    <div className="dashboard-card">
                        <FaMoneyBillWave className="card-icon"/>
                        <h3>Pending / Accepted</h3>
                        <span>{pendingBookings}</span>
                    </div>
                    <div className="dashboard-card">
                        <FaPiggyBank className="card-icon"/>
                        <h3>Earnings (80%)</h3>
                        <span>₹{totalEarnings.toFixed(0)}</span>
                    </div>
                </div>

                <h2 className="section-heading">My Bookings</h2>
                {bookings.length === 0 ? (
                    <div className="empty-state" style={{ background: 'var(--surface)', borderRadius: '24px', padding: '50px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        You have no assigned bookings yet.
                    </div>
                ) : (
                    <div className="booking-list" style={{ marginTop: '0', marginBottom: '60px' }}>
                        {bookings.map(booking => (
                            <div key={booking.bookingId} className="booking-card">
                                <div className="booking-main">
                                    <h3>{booking.serviceName}</h3>
                                    <p>{booking.date} · {booking.bookingTime}</p>
                                    <p className="booking-address">Customer: {booking.customerName || "Customer"} - {booking.serviceAddress}</p>
                                </div>
                                <div className="booking-badges">
                                    <span className={`badge ${statusClass(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="booking-amount">
                                    ₹{booking.finalAmount}
                                </div>
                                <div className="booking-actions">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <button className="pay-btn" onClick={() => handleStatusUpdate(booking.bookingId, "ACCEPTED")}>Accept</button>
                                            <button className="cancel-btn" onClick={() => handleStatusUpdate(booking.bookingId, "CANCELLED")}>Reject</button>
                                        </>
                                    )}
                                    {booking.status === "ACCEPTED" && (
                                        <button className="pay-btn" onClick={() => handleStatusUpdate(booking.bookingId, "COMPLETED")}>Mark Completed</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h2 className="section-heading">Earnings & Payments</h2>
                <div className="recent-bookings" style={{ marginBottom: '60px' }}>
                    {bookings.filter(b => b.paymentStatus).length === 0 ? (
                        <div className="empty-state">No payment records found.</div>
                    ) : (
                        bookings.filter(b => b.paymentStatus).map(booking => (
                            <div key={"pay-" + booking.bookingId} className="booking-row">
                                <span>{booking.serviceName} (Booking #{booking.bookingId})</span>
                                <span className={booking.paymentStatus === "SUCCESS" ? "completed" : "pending"}>
                                    {booking.paymentStatus}
                                </span>
                                <strong>₹{booking.finalAmount}</strong>
                            </div>
                        ))
                    )}
                </div>

                <h2 className="section-heading">My Reviews</h2>
                <div className="recent-bookings" style={{ marginBottom: '60px' }}>
                    {partnerReviews.length === 0 ? (
                        <div className="empty-state">No reviews yet.</div>
                    ) : (
                        partnerReviews.map(review => {
                            const booking = bookings.find(b => b.bookingId === review.bookingId);
                            return (
                                <div key={review.reviewId} className="booking-row" style={{ gridTemplateColumns: "1fr 1fr 2fr", alignItems: "center" }}>
                                    <span>
                                        <strong>{booking?.serviceName}</strong><br/>
                                        Customer: {booking?.customerName}
                                    </span>
                                    <span className="payment-tag">{review.rating} ⭐</span>
                                    <span>"{review.comment}"</span>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}

export default PartnerDashboard;