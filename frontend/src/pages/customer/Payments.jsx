import "./Payments.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const bookingDetails = location.state?.bookingDetails;

    const [activePlan, setActivePlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [payError, setPayError] = useState("");
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    useEffect(() => {
        if (!bookingDetails) {
            navigate("/services");
            return;
        }

        async function loadData() {
            try {
                const subscriptions = await getSubscriptionsByUser(user.userId);
                const active = subscriptions.find(
                    subscription => subscription.status === "ACTIVE"
                );
                const exhausted = subscriptions.find(
                    subscription => subscription.status === "EXHAUSTED"
                );
                setActivePlan(active || exhausted || null);
                
                let finalPrice = bookingDetails.basePrice;
                if (active) {
                    finalPrice = finalPrice - (finalPrice * active.discount / 100.0);
                }
                setCalculatedPrice(Math.round(finalPrice));
            } catch (error) {
                console.error(error);
                setPayError("Unable to load subscription details.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [bookingDetails, user.userId, navigate]);

    async function handlePay() {
        setPayError("");
        setProcessing(true);

        try {
            const [paymentResponse, razorpayConfig] = await Promise.all([
                createPayment({
                    serviceId: bookingDetails.serviceId,
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
                amount: Math.round(paymentResponse.amount * 100),
                currency: "INR",
                order_id: paymentResponse.razorpayOrderId,
                name: "Household Connect",
                description: bookingDetails.serviceName,
                prefill: {
                    name: user.name,
                    email: user.email
                },
                theme: {
                    color: "#c6a15b"
                },
                handler: async function (response) {
                    try {
                        const verifiedPayment = await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            serviceId: bookingDetails.serviceId,
                            date: bookingDetails.date,
                            bookingTime: bookingDetails.bookingTime,
                            serviceAddress: bookingDetails.serviceAddress,
                            paymentMethod: paymentMethod
                        });
                        navigate(`/customer/bookings/${verifiedPayment.bookingId}?confirmed=true`);
                    } catch (verifyError) {
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
        } catch (error) {
            console.error(error);
            if (error.response) {
                setPayError(error.response.data.message || "Unable to start payment.");
            } else {
                setPayError("Unable to connect to server.");
            }
            setProcessing(false);
        }
    }

    if (!bookingDetails) return null;

    if (loading) {
        return (
            <section className="payments-page">
                <div className="container">
                    <h2>Loading...</h2>
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
                            {PAYMENT_METHODS.map(method => (
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
                            ))}
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
                            {processing ? "Processing..." : `Pay ₹${calculatedPrice}`}
                        </button>
                    </div>

                    <aside className="booking-recap">
                        <h3>Booking Summary</h3>
                        <div className="recap-row">
                            <span>Service</span>
                            <strong>{bookingDetails.serviceName}</strong>
                        </div>
                        <div className="recap-row">
                            <span>Date</span>
                            <strong>{bookingDetails.date}</strong>
                        </div>
                        <div className="recap-row">
                            <span>Time</span>
                            <strong>{bookingDetails.bookingTime}</strong>
                        </div>
                        <div className="recap-row">
                            <span>Address</span>
                            <strong>{bookingDetails.serviceAddress}</strong>
                        </div>

                        <div className="recap-divider" />
                        <div className="recap-row">
                            <span>Original Price</span>
                            <strong>₹{bookingDetails.basePrice}</strong>
                        </div>
                        {activePlan && activePlan.status === "ACTIVE" && (
                            <div className="recap-row discount-row" style={{ color: 'green', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                <span>
                                    ✨ Discount Applied with {activePlan.planName} plan!
                                </span>
                            </div>
                        )}
                        {activePlan && activePlan.status === "EXHAUSTED" && (
                            <div className="recap-row discount-row" style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                <span>
                                    ⚠️ Your {activePlan.planName} plan perks are exhausted. Renew to get discounts!
                                </span>
                            </div>
                        )}
                        <div className="recap-row total-row">
                            <span>Total</span>
                            <strong>₹{calculatedPrice}</strong>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default Payments;
