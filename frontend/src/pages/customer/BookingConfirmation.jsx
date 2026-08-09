import "./BookingConfirmation.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { FaCheckCircle } from "react-icons/fa";

import { getBookingById } from "../../api/bookingApi";
import { getPaymentByBooking } from "../../api/paymentApi";

function statusClass(status) {

    switch (status) {

        case "COMPLETED":
        case "SUCCESS":
            return "status-good";

        case "PENDING":
            return "status-pending";

        case "ACCEPTED":
            return "status-accepted";

        case "CANCELLED":
        case "FAILED":
            return "status-bad";

        default:
            return "";

    }

}

function BookingConfirmation() {

    const { bookingId } = useParams();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const justConfirmed = searchParams.get("confirmed") === "true";

    const [booking, setBooking] = useState(null);

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [loadError, setLoadError] = useState("");

    useEffect(() => {

        async function loadData() {

            try {

                const bookingData = await getBookingById(bookingId);

                setBooking(bookingData);

                try {

                    const paymentData = await getPaymentByBooking(bookingId);

                    setPayment(paymentData);

                }

                catch {

                    // No payment created for this booking yet - not an error,
                    // just means the customer hasn't paid.
                    setPayment(null);

                }

            }

            catch (error) {

                console.error(error);

                setLoadError("Unable to load this booking. It may not exist or you may not have access to it.");

            }

            finally {

                setLoading(false);

            }

        }

        loadData();

    }, [bookingId]);

    if (loading) {

        return (

            <section className="booking-confirmation">

                <div className="container">

                    <h2>Loading booking...</h2>

                </div>

            </section>

        );

    }

    if (loadError) {

        return (

            <section className="booking-confirmation">

                <div className="container">

                    <h2>{loadError}</h2>

                </div>

            </section>

        );

    }

    return (

        <section className="booking-confirmation">

            <div className="container">

                <div className="confirmation-card">

                    {justConfirmed &&

                        <div className="confirmation-banner">

                            <FaCheckCircle/>

                            <div>

                                <h1>Booking Confirmed</h1>

                                <p>Your payment was successful. We've notified a partner about your booking.</p>

                            </div>

                        </div>

                    }

                    {!justConfirmed &&

                        <h1 className="confirmation-heading">

                            Booking Details

                        </h1>

                    }

                    <div className="detail-grid">

                        <div className="detail-item">

                            <span>Booking ID</span>

                            <strong>#{booking.bookingId}</strong>

                        </div>

                        <div className="detail-item">

                            <span>Service</span>

                            <strong>{booking.serviceName}</strong>

                        </div>

                        <div className="detail-item">

                            <span>Date</span>

                            <strong>{booking.date}</strong>

                        </div>

                        <div className="detail-item">

                            <span>Time</span>

                            <strong>{booking.bookingTime}</strong>

                        </div>

                        <div className="detail-item full-width">

                            <span>Address</span>

                            <strong>{booking.serviceAddress}</strong>

                        </div>

                        <div className="detail-item">

                            <span>Amount Paid</span>

                            <strong>

                                {payment ? `₹${payment.amount}` : "Not paid yet"}

                            </strong>

                        </div>

                        <div className="detail-item">

                            <span>Payment Method</span>

                            <strong>

                                {payment ? payment.paymentMethod.replaceAll("_", " ") : "—"}

                            </strong>

                        </div>

                        <div className="detail-item">

                            <span>Payment Status</span>

                            <strong className={statusClass(payment ? payment.paymentStatus : "PENDING")}>

                                {payment ? payment.paymentStatus : "NOT STARTED"}

                            </strong>

                        </div>

                        <div className="detail-item">

                            <span>Booking Status</span>

                            <strong className={statusClass(booking.status)}>

                                {booking.status}

                            </strong>

                        </div>

                    </div>

                    <div className="confirmation-actions">

                        {!payment &&

                            <span style={{ color: 'var(--text-secondary)' }}>Payment required at checkout</span>

                        }

                        <button

                            className="secondary-action"

                            onClick={() => navigate("/customer/bookings")}

                        >

                            View My Bookings

                        </button>

                        <button

                            className="secondary-action"

                            onClick={() => navigate("/customer/dashboard")}

                        >

                            Back to Dashboard

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default BookingConfirmation;
