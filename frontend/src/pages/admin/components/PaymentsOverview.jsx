export default function PaymentsOverview({ payments }) {
    const sortedPayments = [...payments].sort((a, b) => b.paymentId - a.paymentId);

    const totalRevenue = payments
        .filter(p => p.paymentStatus === "SUCCESS")
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div>
            <div className="dashboard-header" style={{ marginBottom: "20px" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>Total System Revenue: <span style={{ color: "var(--accent-color)" }}>₹{totalRevenue.toFixed(0)}</span></h2>
                </div>
            </div>

            <div className="recent-bookings">
                {sortedPayments.length === 0 ? (
                    <div className="empty-state">No payments found.</div>
                ) : (
                    sortedPayments.map(payment => (
                        <div key={payment.paymentId} className="booking-row" style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}>
                            <span>Booking #{payment.booking?.bookingId || "N/A"}</span>
                            <span className="payment-tag">{payment.paymentMethod || "UNKNOWN"}</span>
                            <span className={payment.paymentStatus === "SUCCESS" ? "completed" : "pending"}>{payment.paymentStatus}</span>
                            <strong>₹{payment.amount}</strong>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
