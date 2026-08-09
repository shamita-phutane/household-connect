import { useState } from "react";
import { FaUsers, FaUserTie, FaClipboardList, FaPiggyBank } from "react-icons/fa";
import { getPartnersByService } from "../../../api/userApi";
import { assignPartner } from "../../../api/bookingApi";

function getStatusStyles(status) {
    switch (status) {
        case "COMPLETED": return { background: '#d1fae5', color: '#065f46' };
        case "PENDING": return { background: '#fef3c7', color: '#92400e' };
        case "ACCEPTED": return { background: '#dbeafe', color: '#1e40af' };
        case "CANCELLED": return { background: '#fee2e2', color: '#991b1b' };
        default: return { background: 'transparent', color: 'inherit' };
    }
}

export default function AdminOverview({ users, bookings, payments, services, refreshBookings }) {
    const totalUsers = users.filter(u => u.role === "CUSTOMER").length;
    const allPartners = users.filter(u => u.role === "PARTNER");
    const totalPartners = allPartners.length;
    const totalBookings = bookings.length;
    
    // Platform Fee = 20%
    const totalRevenue = payments
        .filter(p => p.paymentStatus === "SUCCESS")
        .reduce((sum, p) => sum + (p.amount || 0), 0) * 0.2;

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [serviceFilter, setServiceFilter] = useState("");
    const [partnerFilter, setPartnerFilter] = useState("");

    const [assigningBooking, setAssigningBooking] = useState(null);
    const [partnersList, setPartnersList] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState("");

    const filteredBookings = bookings.filter(b => {
        if (statusFilter !== "ALL") {
            if (statusFilter === "ASSIGNED" && (b.partnerName == null || b.status === "CANCELLED")) return false;
            if (statusFilter !== "ASSIGNED" && b.status !== statusFilter) return false;
        }
        if (serviceFilter && b.serviceId !== Number(serviceFilter)) return false;
        if (partnerFilter && b.partnerId !== Number(partnerFilter)) return false;
        return true;
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
            <style>
                {`
                    .admin-table-row:hover {
                        background-color: rgba(255,255,255,0.03);
                    }
                `}
            </style>
            
            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: "40px" }}>
                <div className="dashboard-card">
                    <FaUsers className="card-icon" />
                    <h3>Total Customers</h3>
                    <span>{totalUsers}</span>
                </div>
                <div className="dashboard-card">
                    <FaUserTie className="card-icon" />
                    <h3>Total Partners</h3>
                    <span>{totalPartners}</span>
                </div>
                <div className="dashboard-card">
                    <FaClipboardList className="card-icon" />
                    <h3>Total Bookings</h3>
                    <span>{totalBookings}</span>
                </div>
                <div className="dashboard-card">
                    <FaPiggyBank className="card-icon" />
                    <h3>Platform Revenue (20%)</h3>
                    <span>₹{totalRevenue.toFixed(0)}</span>
                </div>
            </div>

            {/* Bookings Section */}
            <div className="dashboard-card" style={{ padding: "30px", background: "var(--surface)", borderRadius: "10px" }}>
                <h2 style={{ marginBottom: "20px" }}>Bookings Management</h2>
                
                {/* Filters Row */}
                <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {["ALL", "PENDING", "ASSIGNED", "COMPLETED", "CANCELLED"].map(status => (
                            <button 
                                key={status}
                                className="pay-btn" 
                                onClick={() => setStatusFilter(status)}
                                style={{ 
                                    background: statusFilter === status ? "var(--accent-color)" : "transparent", 
                                    color: statusFilter === status ? "#000" : "var(--accent-color)",
                                    border: "1px solid var(--accent-color)",
                                    padding: "6px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "15px" }}>
                        <select 
                            value={serviceFilter} 
                            onChange={e => setServiceFilter(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: "6px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)", fontSize: "14px" }}
                        >
                            <option value="">All Services</option>
                            {services && services.map(s => (
                                <option key={s.serviceId} value={s.serviceId}>{s.svcName}</option>
                            ))}
                        </select>

                        <select 
                            value={partnerFilter} 
                            onChange={e => setPartnerFilter(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: "6px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)", fontSize: "14px" }}
                        >
                            <option value="">All Partners</option>
                            {allPartners && allPartners.map(p => (
                                <option key={p.userId} value={p.userId}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--text-secondary)" }}>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Customer</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Service</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>City / Location</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Date</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Status</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Partner</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Amount</th>
                                <th style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "600" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                sortedBookings.map(booking => (
                                    <tr key={booking.bookingId} className="admin-table-row" style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", fontWeight: "600", fontSize: "14px" }}>
                                            {booking.customerName || "N/A"}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", fontWeight: "600", fontSize: "14px" }}>
                                            {booking.serviceName}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", color: "var(--text-secondary)", fontSize: "14px" }}>
                                            {booking.serviceAddress || booking.city || "N/A"}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", color: "var(--text-secondary)", fontSize: "14px", whiteSpace: "nowrap" }}>
                                            {booking.date}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                                            <span 
                                                style={{ 
                                                    ...getStatusStyles(booking.status), 
                                                    padding: "4px 10px", 
                                                    borderRadius: "12px", 
                                                    fontSize: "12px", 
                                                    fontWeight: "500" 
                                                }}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", fontSize: "14px", color: booking.partnerName ? "var(--text-primary)" : "#9ca3af", fontStyle: "normal" }}>
                                            {booking.partnerName || "Unassigned"}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle", fontWeight: "bold", fontSize: "14px" }}>
                                            ₹{booking.finalAmount}
                                        </td>
                                        <td style={{ padding: "16px 12px", verticalAlign: "middle" }}>
                                            {!booking.partnerName && booking.status !== "CANCELLED" ? (
                                                <button 
                                                    className="pay-btn" 
                                                    style={{ padding: "6px 12px", fontSize: "12px", whiteSpace: "nowrap" }}
                                                    onClick={() => handleAssignClick(booking)}
                                                >
                                                    Assign Partner
                                                </button>
                                            ) : (
                                                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            {assigningBooking && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
                    background: "rgba(0,0,0,0.7)", display: "flex", 
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div className="dashboard-card" style={{ width: "400px", padding: "30px", background: "var(--surface)" }}>
                        <h2>Assign Partner</h2>
                        <p style={{ fontSize: "14px", marginBottom: "8px" }}>Service: <strong>{assigningBooking.serviceName}</strong></p>
                        <p style={{ fontSize: "14px" }}>Customer: {assigningBooking.customerName}</p>
                        
                        <div style={{ margin: "20px 0" }}>
                            <label style={{ display: "block", marginBottom: "10px", color: "var(--text-secondary)", fontSize: "14px" }}>
                                Select Available Partner
                            </label>
                            <select 
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)", fontSize: "14px" }}
                                value={selectedPartner}
                                onChange={(e) => setSelectedPartner(e.target.value)}
                            >
                                <option value="">-- Choose a partner --</option>
                                {partnersList.map(p => (
                                    <option key={p.userId} value={p.userId}>{p.name} ({p.city})</option>
                                ))}
                            </select>
                            {partnersList.length === 0 && <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "10px" }}>No qualified partners found for this service.</p>}
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
