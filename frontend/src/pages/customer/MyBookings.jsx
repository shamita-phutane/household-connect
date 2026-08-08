import "./MyBookings.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getCustomerBookings } from "../../api/bookingApi";

function bookingStatusClass(status) {

    switch (status) {

        case "COMPLETED":
            return "completed";

        case "PENDING":
            return "pending";

        case "ACCEPTED":
            return "accepted";

        case "CANCELLED":
            return "cancelled";

        default:
            return "";

    }

}

function paymentStatusLabel(paymentStatus) {

    if (!paymentStatus) {
        return "Not Paid";
    }

    if (paymentStatus === "SUCCESS") {
        return "Paid";
    }

    return paymentStatus.charAt(0) + paymentStatus.slice(1).toLowerCase();

}

function paymentStatusClass(paymentStatus) {

    if (!paymentStatus || paymentStatus === "FAILED") {
        return "payment-bad";
    }

    if (paymentStatus === "SUCCESS") {
        return "payment-good";
    }

    return "payment-pending";

}

function MyBookings() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        async function loadBookings() {

            try {

                const data = await getCustomerBookings(user.userId);

                const sorted = [...data].sort((a, b) => {

                    if (a.date === b.date) {
                        return 0;
                    }

                    return a.date < b.date ? 1 : -1;

                });

                setBookings(sorted);

            }

            catch (err) {

                console.error(err);

                setError("Unable to load your bookings right now.");

            }

            finally {

                setLoading(false);

            }

        }

        loadBookings();

    }, [user.userId]);

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

                <h1>My Bookings</h1>

                <p className="my-bookings-subtitle">

                    Every service you've booked, in one place.

                </p>

                {bookings.length === 0

                    ?

                    <div className="empty-bookings">

                        <p>You haven't booked any services yet.</p>

                        <button onClick={() => navigate("/customer/book-service")}>

                            Book a Service

                        </button>

                    </div>

                    :

                    <div className="booking-list">

                        {

                            bookings.map(booking => (

                                <div

                                    key={booking.bookingId}
                                    className="booking-card"

                                >

                                    <div className="booking-main">

                                        <h3>{booking.serviceName}</h3>

                                        <p>{booking.date} · {booking.bookingTime}</p>

                                        <p className="booking-address">{booking.serviceAddress}</p>

                                    </div>

                                    <div className="booking-badges">

                                        <span className={`badge ${bookingStatusClass(booking.status)}`}>

                                            {booking.status}

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

                                            <button
                                                className="pay-btn"
                                                onClick={() => navigate(`/customer/payments/${booking.bookingId}`)}
                                            >
                                                Pay Now
                                            </button>

                                        )}

                                        {booking.paymentStatus === "SUCCESS" && (

                                            <button
                                                className="details-btn"
                                                onClick={() => navigate(`/customer/bookings/${booking.bookingId}`)}
                                            >
                                                View Details
                                            </button>

                                        )}

                                        {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                                            
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => alert("Cancellation will be supported soon.")}
                                            >
                                                Cancel Booking
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                }

            </div>

        </section>

    );

}

export default MyBookings;
