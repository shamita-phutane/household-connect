import { FaUsers, FaUserTie, FaClipboardList, FaPiggyBank } from "react-icons/fa";

export default function AdminOverview({ users, bookings, payments }) {
    const totalUsers = users.filter(u => u.role === "CUSTOMER").length;
    const totalPartners = users.filter(u => u.role === "PARTNER").length;
    const totalBookings = bookings.length;
    const totalRevenue = payments
        .filter(p => p.paymentStatus === "SUCCESS")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div className="stats-grid">
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
                <h3>Total Revenue</h3>
                <span>₹{totalRevenue.toFixed(0)}</span>
            </div>
        </div>
    );
}
