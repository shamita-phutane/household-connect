import "./Payments.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getBookingById } from "../../api/bookingApi";
import { getSubscriptionsByUser } from "../../api/userSubscriptionApi";
import { createPayment, verifyPayment, getRazorpayKey } from "../../api/paymentApi";

const PAYMENT_METHODS = [

    { value: "UPI", label: "UPI" },
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "DEBIT_CARD", label: "Debit Card" },
    { value: "NET_BANKING", label: "Net Banking" },
    { value: "CASH", label: "Cash" }

];

function Payments() {

    const { bookingId } = useParams();

    const { user } = useAuth();

    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);

    const [activePlan, setActivePlan] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const [loading, setLoading] = useState(true);

    const [loadError, setLoadError] = useState("");

    const [processing, setProcessing] = useState(false);

    const [payError, setPayError] = useState("");

    useEffect(() => {

        async function loadData() {

            try {

                const [bookingData, subscriptions] = await Promise.all([

                    getBookingById(bookingId),

                    getSubscriptionsByUser(user.userId)

                ]);

                if (bookingData.paymentStatus === "SUCCESS") {

                    navigate(`/customer/bookings/${bookingId}?confirmed=true`, { replace: true });

                    return;

                }

                setBooking(bookingData);

                const active = subscriptions.find(
                    subscription => subscription.status === "ACTIVE"
                );

                setActivePlan(active || null);

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

    }, [bookingId, user.userId, navigate]);

    async function handlePay() {

        setPayError("");

        setProcessing(true);

        try {

            const [payment, razorpayConfig] = await Promise.all([

                createPayment({

                    bookingId: booking.bookingId,

                    paymentMethod

                }),

                getRazorpayKey()

            ]);

            if (!window.Razorpay) {

                setPayError("Payment gateway failed to load. Please refresh and try again.");

                setProcessing(false);

                return;

            }

            const checkout = new window.Razorpay({

                key: razorpayConfig.keyId,

                amount: Math.round(payment.amount * 100),

                currency: "INR",

                order_id: payment.razorpayOrderId,

                name: "Household Connect",

                description: booking.serviceName,

                prefill: {

                    name: user.name,

                    email: user.email

                },

                theme: {

                    color: "#c6a15b"

                },

                handler: async function (response) {

                    try {

                        await verifyPayment({

                            paymentId: payment.paymentId,

                            razorpayPaymentId: response.razorpay_payment_id,

                            razorpayOrderId: response.razorpay_order_id

                        });

                        navigate(`/customer/bookings/${booking.bookingId}?confirmed=true`);

                    }

                    catch (verifyError) {

                        console.error(verifyError);

                        setPayError(

                            "Payment went through but we couldn't verify it. Please contact support with payment id: " +
                            response.razorpay_payment_id

                        );

                        setProcessing(false);

                    }

                },

                modal: {

                    ondismiss: function () {

                        setProcessing(false);

                    }

                }

            });

            checkout.on("payment.failed", function (response) {

                console.error(response.error);

                setPayError("Payment failed: " + response.error.description);

                setProcessing(false);

            });

            checkout.open();

        }

        catch (error) {

            console.error(error);

            if (error.response) {
                setPayError(error.response.data.message || "Unable to start payment.");
            }
            else {
                setPayError("Unable to connect to server.");
            }

            setProcessing(false);

        }

    }

    if (loading) {

        return (

            <section className="payments-page">

                <div className="container">

                    <h2>Loading booking...</h2>

                </div>

            </section>

        );

    }

    if (loadError) {

        return (

            <section className="payments-page">

                <div className="container">

                    <h2>{loadError}</h2>

                </div>

            </section>

        );

    }

    return (

        <section className="payments-page">

            <div className="container">

                <h1>Complete Payment</h1>

                <p className="payments-subtitle">

                    Review your booking and choose how you'd like to pay.

                </p>

                <div className="payments-layout">

                    <div className="payment-methods-card">

                        <h3>Payment Method</h3>

                        <div className="method-grid">

                            {

                                PAYMENT_METHODS.map(method => (

                                    <button

                                        key={method.value}

                                        type="button"

                                        className={

                                            paymentMethod === method.value
                                                ? "method-option active"
                                                : "method-option"

                                        }

                                        onClick={() => setPaymentMethod(method.value)}

                                    >

                                        {method.label}

                                    </button>

                                ))

                            }

                        </div>

                        {payError &&

                            <p className="form-error">

                                {payError}

                            </p>

                        }

                        <button

                            className="pay-now-btn"

                            onClick={handlePay}

                            disabled={processing}

                        >

                            {

                                processing
                                    ? "Processing..."
                                    : `Pay ₹${booking.finalAmount}`

                            }

                        </button>

                    </div>

                    <aside className="booking-recap">

                        <h3>Booking Summary</h3>

                        <div className="recap-row">

                            <span>Service</span>

                            <strong>{booking.serviceName}</strong>

                        </div>

                        <div className="recap-row">

                            <span>Date</span>

                            <strong>{booking.date}</strong>

                        </div>

                        <div className="recap-row">

                            <span>Time</span>

                            <strong>{booking.bookingTime}</strong>

                        </div>

                        <div className="recap-row">

                            <span>Address</span>

                            <strong>{booking.serviceAddress}</strong>

                        </div>

                        <div className="recap-divider" />

                        <div className="recap-row">

                            <span>Original Price</span>

                            <strong>₹{booking.originalAmount}</strong>

                        </div>

                        {booking.discountAmount > 0 &&

                            <div className="recap-row discount-row">

                                <span>

                                    {activePlan ? `${activePlan.planName} Discount` : "Membership Discount"}

                                </span>

                                <strong>-₹{booking.discountAmount}</strong>

                            </div>

                        }

                        <div className="recap-row total-row">

                            <span>Total</span>

                            <strong>₹{booking.finalAmount}</strong>

                        </div>

                    </aside>

                </div>

            </div>

        </section>

    );

}

export default Payments;
