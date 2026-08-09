import { useState } from "react";
import { getPartnersByService } from "../../../api/userApi";
import { assignPartner } from "../../../api/bookingApi";

function statusClass(status) {
    switch (status) {
        case "COMPLETED": return "completed";
        case "PENDING": return "pending";
        case "ACCEPTED": return "accepted";
        case "CANCELLED": return "cancelled";
        default: return "";
    }
}

export default function BookingsOverview({ bookings, refreshBookings }) {
    const [filter, setFilter] = useState("ALL");
    const [showFilters, setShowFilters] = useState(false);

    const [assigningBooking, setAssigningBooking] = useState(null);
    const [partnersList, setPartnersList] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState("");

    const filteredBookings = bookings.filter(b => {
        if (filter === "ALL") return true;
        return b.status === filter;
    });

    const sortedBookings = [...filteredBookings].sort((a, b) => (a.date < b.date ? 1 : -1));

    async function handleAssignClick(booking) {
        setAssigningBooking(booking);
        setPartnersList([]);
        setSelectedPartner("");
        try {
            const partners = await getPartnersByService(booking.serviceId);
            setPartnersList(partners);
        } catch (err) {
            console.error("Failed to load partners", err);
            alert("Failed to load available partners for this service.");
        }
    }

    async function handleConfirmAssign() {
        if (!selectedPartner) return;
        try {
            await assignPartner(assigningBooking.bookingId, selectedPartner);
            alert("Partner assigned successfully!");
            setAssigningBooking(null);
            if (refreshBookings) refreshBookings();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to assign partner.");
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <button className="pay-btn" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {showFilters && (
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
            )}

            <div className="recent-bookings">
                {sortedBookings.length === 0 ? (
                    <div className="empty-state">No bookings found.</div>
                ) : (
                    sortedBookings.map(booking => (
                        <div key={booking.bookingId} className="booking-row" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.5fr" }}>
                            <span><strong>{booking.serviceName}</strong><br/>{booking.date}</span>
                            <span>Customer:<br/>{booking.customerName || "N/A"}</span>
                            <span>
                                Partner:<br/>
                                {booking.partnerName ? (
                                    booking.partnerName
                                ) : (
                                    <span style={{ color: "var(--danger)" }}>Unassigned</span>
                                )}
                            </span>
                            <span><strong>₹{booking.finalAmount}</strong></span>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
                                <span className={statusClass(booking.status)}>{booking.status}</span>
                                {!booking.partnerName && booking.status !== "CANCELLED" && (
                                    <button 
                                        className="pay-btn" 
                                        style={{ padding: "5px 10px", fontSize: "0.8rem", width: "100%" }}
                                        onClick={() => handleAssignClick(booking)}
                                    >
                                        Assign Partner
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {assigningBooking && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
                    background: "rgba(0,0,0,0.7)", display: "flex", 
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div className="dashboard-card" style={{ width: "400px", padding: "30px", background: "var(--surface)" }}>
                        <h2>Assign Partner</h2>
                        <p>Service: <strong>{assigningBooking.serviceName}</strong></p>
                        <p>Customer: {assigningBooking.customerName}</p>
                        
                        <div style={{ margin: "20px 0" }}>
                            <label style={{ display: "block", marginBottom: "10px", color: "var(--text-secondary)" }}>
                                Select Available Partner
                            </label>
                            <select 
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                                value={selectedPartner}
                                onChange={(e) => setSelectedPartner(e.target.value)}
                            >
                                <option value="">-- Choose a partner --</option>
                                {partnersList.map(p => (
                                    <option key={p.userId} value={p.userId}>{p.name} ({p.city})</option>
                                ))}
                            </select>
                            {partnersList.length === 0 && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "10px" }}>No qualified partners found for this service.</p>}
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button 
                                className="pay-btn" 
                                style={{ background: "transparent", color: "var(--text-primary)" }}
                                onClick={() => setAssigningBooking(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="pay-btn"
                                onClick={handleConfirmAssign}
                                disabled={!selectedPartner}
                                style={{ opacity: selectedPartner ? 1 : 0.5 }}
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
