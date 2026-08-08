export default function PartnerManagement({ users }) {
    const partners = users.filter(user => user.role === "PARTNER");

    return (
        <div className="recent-bookings">
            {partners.length === 0 ? (
                <div className="empty-state">No partners found.</div>
            ) : (
                partners.map(partner => (
                    <div key={partner.userId} className="booking-row" style={{ gridTemplateColumns: "2fr 1fr 1fr auto" }}>
                        <span><strong>{partner.name}</strong></span>
                        <span>{partner.email}</span>
                        <span className="payment-tag">Rating: {partner.avgRating?.toFixed(1) || "N/A"} ⭐</span>
                        <button className="pay-btn" onClick={() => alert("Approval flow coming soon!")}>Manage</button>
                    </div>
                ))
            )}
        </div>
    );
}
