import { useState } from "react";
import { deleteUser } from "../../../api/userApi";

export default function UserManagement({ users, refreshUsers }) {
    const [filter, setFilter] = useState("ALL");

    const filteredUsers = users.filter(user => {
        if (filter === "ALL") return user.role !== "ADMIN";
        return user.role === filter;
    });

    async function handleDelete(userId) {
        if (!window.confirm("Are you sure you want to deactivate this user?")) return;
        try {
            await deleteUser(userId);
            refreshUsers();
        } catch (err) {
            alert("Failed to deactivate user.");
            console.error(err);
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button 
                    className="pay-btn" 
                    onClick={() => setFilter("ALL")}
                    style={{ background: filter === "ALL" ? "var(--accent-color)" : "transparent", color: filter === "ALL" ? "#000" : "var(--accent-color)" }}
                >
                    All
                </button>
                <button 
                    className="pay-btn" 
                    onClick={() => setFilter("CUSTOMER")}
                    style={{ background: filter === "CUSTOMER" ? "var(--accent-color)" : "transparent", color: filter === "CUSTOMER" ? "#000" : "var(--accent-color)" }}
                >
                    Customers
                </button>
                <button 
                    className="pay-btn" 
                    onClick={() => setFilter("PARTNER")}
                    style={{ background: filter === "PARTNER" ? "var(--accent-color)" : "transparent", color: filter === "PARTNER" ? "#000" : "var(--accent-color)" }}
                >
                    Partners
                </button>
            </div>

            <div className="recent-bookings">
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">No users found.</div>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.userId} className="booking-row" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
                            <span><strong>{user.name}</strong></span>
                            <span>{user.email}</span>
                            <span className="payment-tag">{user.role}</span>
                            <span>{user.city}</span>
                            <button className="cancel-btn" onClick={() => handleDelete(user.userId)}>Deactivate</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
