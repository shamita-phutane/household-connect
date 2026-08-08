import "../customer/MyBookings.css"; // Reuse existing styles
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPartnerBookings, updateBookingStatus } from "../../api/bookingApi";

function bookingStatusClass(status) {
    switch (status) {
        case "COMPLETED": return "completed";
        case "PENDING": return "pending";
        case "ACCEPTED": return "accepted";
        case "CANCELLED": return "cancelled";
        default: return "";
    }
}

function PartnerBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBookings();
    }, [user.userId]);

    async function loadBookings() {
        setLoading(true);
        try {
            const data = await getPartnerBookings(user.userId);
            const sorted = [...data].sort((a, b) => {
                if (a.date === b.date) return 0;
                return a.date < b.date ? 1 : -1;
            });
            setBookings(sorted);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load partner bookings right now.");
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusUpdate(bookingId, newStatus) {
        try {
            await updateBookingStatus(bookingId, newStatus);
            // Update UI locally without reload
            setBookings(prevBookings => 
                prevBookings.map(b => 
                    b.bookingId === bookingId ? { ...b, status: newStatus } : b
                )
            );
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update booking status. Please try again.");
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
                <h1>Partner Dashboard</h1>
                <p className="my-bookings-subtitle">
                    Manage your assigned service bookings.
                </p>

                {bookings.length === 0 ? (
                    <div className="empty-bookings">
                        <p>You have no assigned bookings yet.</p>
                    </div>
                ) : (
                    <div className="booking-list">
                        {bookings.map(booking => (
                            <div key={booking.bookingId} className="booking-card">
                                <div className="booking-main">
                                    <h3>{booking.serviceName}</h3>
                                    <p>{booking.date} · {booking.bookingTime}</p>
                                    {/* Customer name wasn't originally in the card, assuming there's customer details in DTO. If not, this is a placeholder */}
                                    <p className="booking-address">Customer: {booking.customerName || "Customer Name"} - {booking.serviceAddress}</p>
                                </div>
                                <div className="booking-badges">
                                    <span className={`badge ${bookingStatusClass(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="booking-amount">
                                    ₹{booking.finalAmount}
                                </div>
                                <div className="booking-actions">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <button 
                                                className="pay-btn" 
                                                onClick={() => handleStatusUpdate(booking.bookingId, "ACCEPTED")}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => handleStatusUpdate(booking.bookingId, "CANCELLED")}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {booking.status === "ACCEPTED" && (
                                        <button 
                                            className="pay-btn" 
                                            onClick={() => handleStatusUpdate(booking.bookingId, "COMPLETED")}
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PartnerBookings;
