import { useState } from "react";

function statusClass(status) {
    switch (status) {
        case "COMPLETED": return "completed";
        case "PENDING": return "pending";
        case "ACCEPTED": return "accepted";
        case "CANCELLED": return "cancelled";
        default: return "";
    }
}

export default function BookingsOverview({ bookings }) {
    const [filter, setFilter] = useState("ALL");

    const filteredBookings = bookings.filter(b => {
        if (filter === "ALL") return true;
        return b.status === filter;
    });

    const sortedBookings = [...filteredBookings].sort((a, b) => (a.date < b.date ? 1 : -1));

    return (
        <div>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                {["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"].map(status => (
                    <button 
                        key={status}
                        className="pay-btn" 
                        onClick={() => setFilter(status)}
                        style={{ background: filter === status ? "var(--accent-color)" : "transparent", color: filter === status ? "#000" : "var(--accent-color)" }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="recent-bookings">
                {sortedBookings.length === 0 ? (
                    <div className="empty-state">No bookings found.</div>
                ) : (
                    sortedBookings.map(booking => (
                        <div key={booking.bookingId} className="booking-row" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr" }}>
                            <span><strong>{booking.serviceName}</strong><br/>{booking.date}</span>
                            <span>Customer:<br/>{booking.customerName || "N/A"}</span>
                            <span>Partner:<br/>{booking.partnerName || "Unassigned"}</span>
                            <span><strong>₹{booking.finalAmount}</strong></span>
                            <span className={statusClass(booking.status)}>{booking.status}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
