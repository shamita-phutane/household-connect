import "./CustomerDashboard.css";

import {
    FaCalendarCheck,
    FaClipboardList,
    FaCreditCard,
    FaCrown,
    FaArrowRight
} from "react-icons/fa";

function CustomerDashboard() {

    return (

        <div className="customer-dashboard">

            <div className="container">

                <div className="dashboard-header">

                    <div>

                        <span className="dashboard-tag">

                            Customer Dashboard

                        </span>

                        <h1>

                            Welcome back 👋

                        </h1>

                        <p>

                            Manage your bookings, payments and membership from one place.

                        </p>

                    </div>

                </div>

                <div className="stats-grid">

                    <div className="dashboard-card">

                        <FaCalendarCheck className="card-icon"/>

                        <h3>

                            Upcoming Bookings

                        </h3>

                        <span>

                            2

                        </span>

                    </div>

                    <div className="dashboard-card">

                        <FaClipboardList className="card-icon"/>

                        <h3>

                            Total Bookings

                        </h3>

                        <span>

                            18

                        </span>

                    </div>

                    <div className="dashboard-card">

                        <FaCreditCard className="card-icon"/>

                        <h3>

                            Saved

                        </h3>

                        <span>

                            ₹240

                        </span>

                    </div>

                    <div className="dashboard-card">

                        <FaCrown className="card-icon"/>

                        <h3>

                            Membership

                        </h3>

                        <span>

                            Gold

                        </span>

                    </div>

                </div>

                <h2 className="section-heading">

                    Quick Actions

                </h2>

                <div className="actions-grid">

                    <button>

                        Book a Service

                        <FaArrowRight/>

                    </button>

                    <button>

                        My Bookings

                        <FaArrowRight/>

                    </button>

                    <button>

                        Payments

                        <FaArrowRight/>

                    </button>

                    <button>

                        Profile

                        <FaArrowRight/>

                    </button>

                </div>

                <h2 className="section-heading">

                    Recent Bookings

                </h2>

                <div className="recent-bookings">

                    <div className="booking-row">

                        <span>

                            AC Repair

                        </span>

                        <span className="completed">

                            Completed

                        </span>

                        <strong>

                            ₹599

                        </strong>

                    </div>

                    <div className="booking-row">

                        <span>

                            Deep Cleaning

                        </span>

                        <span className="pending">

                            Pending

                        </span>

                        <strong>

                            ₹1299

                        </strong>

                    </div>

                    <div className="booking-row">

                        <span>

                            Electrical Repair

                        </span>

                        <span className="accepted">

                            Accepted

                        </span>

                        <strong>

                            ₹399

                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CustomerDashboard;