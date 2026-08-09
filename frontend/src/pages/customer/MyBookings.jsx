import "./MyBookings.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getCustomerBookings, updateBookingStatus } from "../../api/bookingApi";
import { getAllReviews, createReview } from "../../api/reviewApi";

function bookingStatusClass(status) {
    switch (status) {
        case "COMPLETED": return "completed";
        case "PENDING": return "pending";
        case "ACCEPTED": return "accepted";
        case "CANCELLED":
        case "REJECTED": return "cancelled";
        default: return "";
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

function paymentStatusLabel(paymentStatus) {
    if (!paymentStatus) return "Payment Pending";
    if (paymentStatus === "SUCCESS") return "Payment Success";
    if (paymentStatus === "FAILED") return "Payment Failed";
    return paymentStatus.charAt(0) + paymentStatus.slice(1).toLowerCase();
}

function paymentStatusClass(paymentStatus) {
    if (!paymentStatus || paymentStatus === "FAILED") return "payment-bad";
    if (paymentStatus === "SUCCESS") return "payment-good";
    return "payment-pending";
}

function MyBookings() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reviewModal, setReviewModal] = useState({ open: false, bookingId: null, rating: 5, comment: "" });

    async function loadData() {
        try {
            const [bookingData, reviewData] = await Promise.all([
                getCustomerBookings(user.userId),
                getAllReviews()
            ]);
            
            const sorted = [...bookingData].sort((a, b) => {
                if (a.date === b.date) return 0;
                return a.date < b.date ? 1 : -1;
            });

            setBookings(sorted);
            setReviews(reviewData);
        } catch (err) {
            console.error(err);
            setError("Unable to load your bookings right now.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [user.userId]);

    async function submitReview(e) {
        e.preventDefault();
        try {
            const newReview = await createReview({
                bookingId: reviewModal.bookingId,
                rating: reviewModal.rating,
                comment: reviewModal.comment
            });
            setReviews(prev => [...prev, newReview]);
            setReviewModal({ open: false, bookingId: null, rating: 5, comment: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to submit review.");
        }
    }
        
    async function handleCancelBooking(booking) {
        if (!booking.date || !booking.bookingTime) {
            alert("Unable to cancel: missing booking date/time.");
            return;
        }

        const bookingDateTime = new Date(`${booking.date}T${booking.bookingTime}`);
        const now = new Date();
        const diffMs = bookingDateTime - now;
        
        if (diffMs < 24 * 60 * 60 * 1000) {
            alert("Cancellations must be made at least 24 hours in advance.");
            return;
        }

        if (window.confirm("Are you sure you want to cancel this booking? Your refund will be processed within 5-7 business days.")) {
            try {
                await updateBookingStatus(booking.bookingId, "CANCELLED");
                setBookings(prev => prev.map(b => b.bookingId === booking.bookingId ? { ...b, status: "CANCELLED" } : b));
                alert("Booking cancelled successfully. A refund will be initiated.");
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || "Failed to cancel booking.");
            }
        }
    }

    if (loading) {
        return (
            <section className="my-bookings">
                <div className="container">
                    <h2>Loading bookings...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="my-bookings">
                <div className="container">
                    <h2>{error}</h2>
                </div>
            </section>
        );
    }

    return (
        <section className="my-bookings">
            <div className="container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h1>My Bookings</h1>
                    <button 
                        onClick={() => navigate("/customer/dashboard")} 
                        className="pay-btn" 
                        style={{ background: "transparent", color: "var(--accent-color)", border: "1px solid var(--accent-color)", padding: "8px 16px" }}
                    >
                        Back to Dashboard
                    </button>
                </div>
                <p className="my-bookings-subtitle">
                    Every service you've booked, in one place.
                </p>

                {bookings.length === 0 ? (
                    <div className="empty-bookings">
                        <p>You haven't booked any services yet.</p>
                        <button onClick={() => navigate("/customer/book-service")}>Book a Service</button>
                    </div>
                ) : (
                    <div className="booking-list">
                        {bookings.map(booking => {
                            const existingReview = reviews.find(r => r.bookingId === booking.bookingId);

                            return (
                                <div key={booking.bookingId} className="booking-card">
                                    <div className="booking-main">
                                        <h3>{booking.serviceName}</h3>
                                        <p>{booking.date} · {booking.bookingTime}</p>
                                        <p className="booking-address">{booking.serviceAddress}</p>
                                    </div>
                                    <div className="booking-badges">
                                        <span className={`badge ${bookingStatusClass(booking.status)}`}>
                                            {bookingStatusLabel(booking.status)}
                                        </span>
                                        <span className={`badge ${paymentStatusClass(booking.paymentStatus)}`}>
                                            {paymentStatusLabel(booking.paymentStatus)}
                                        </span>
                                    </div>
                                    <div className="booking-amount">
                                        ₹{booking.finalAmount}
                                    </div>
                                    <div className="booking-actions">
                                        {booking.paymentStatus !== "SUCCESS" && booking.status !== "CANCELLED" && (
                                            <span style={{ color: 'var(--text-secondary)' }}>Payment required at checkout</span>
                                        )}

                                        {booking.paymentStatus === "SUCCESS" && (
                                            <button className="details-btn" onClick={() => navigate(`/customer/bookings/${booking.bookingId}`)}>
                                                View Details
                                            </button>
                                        )}

                                        {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                                            <button className="cancel-btn" onClick={() => handleCancelBooking(booking)}>
                                                Cancel Booking
                                            </button>
                                        )}
                                        
                                        {(booking.status === "CANCELLED" || booking.status === "REJECTED") && (
                                            <span style={{ color: "var(--danger)", fontSize: "0.9rem", display: "block", marginTop: "10px" }}>
                                                Refund will be processed in 5-7 business days.
                                            </span>
                                        )}

                                        {booking.status === "COMPLETED" && !existingReview && (
                                            <button className="pay-btn" onClick={() => setReviewModal({ open: true, bookingId: booking.bookingId, rating: 5, comment: "" })}>
                                                Leave Review
                                            </button>
                                        )}
                                        
                                        {existingReview && (
                                            <div style={{ padding: "10px", background: "var(--surface-secondary)", borderRadius: "8px", border: "1px solid var(--border)", flex: "1 1 100%" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                                    <strong className="completed">Reviewed</strong>
                                                    <span>{existingReview.rating} ⭐</span>
                                                </div>
                                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>"{existingReview.comment}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {reviewModal.open && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <form onSubmit={submitReview} style={{ background: "var(--surface)", padding: "30px", borderRadius: "20px", width: "100%", maxWidth: "400px", border: "1px solid var(--border)" }}>
                        <h2 style={{ marginBottom: "20px" }}>Leave a Review</h2>
                        <label style={{ display: "block", marginBottom: "15px" }}>
                            Rating (1-5):
                            <select 
                                value={reviewModal.rating} 
                                onChange={e => setReviewModal({...reviewModal, rating: parseInt(e.target.value)})}
                                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                            >
                                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                            </select>
                        </label>
                        <label style={{ display: "block", marginBottom: "20px" }}>
                            Comment:
                            <textarea 
                                value={reviewModal.comment} 
                                onChange={e => setReviewModal({...reviewModal, comment: e.target.value})}
                                required
                                rows={4}
                                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "8px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)", resize: "none" }}
                            />
                        </label>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button type="button" className="cancel-btn" onClick={() => setReviewModal({ open: false, bookingId: null, rating: 5, comment: "" })}>Cancel</button>
                            <button type="submit" className="pay-btn">Submit Review</button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default MyBookings;
