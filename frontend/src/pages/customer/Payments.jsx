import "./Payments.css";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { createPayment } from "../../api/paymentApi";

function Payments() {

    const location = useLocation();

    const booking = location.state?.booking;

    const [loading, setLoading] = useState(true);

    const [payment, setPayment] = useState(null);

    useEffect(() => {

        async function createOrder() {

            if (!booking) {

                setLoading(false);

                return;

            }

            try {

                const response = await createPayment({

                    bookingId: booking.bookingId,

                    paymentMethod: "ONLINE"

                });

                setPayment(response);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        }

        createOrder();

    }, [booking]);

    if (!booking) {

        return (

            <div className="container">

                <h2>

                    Booking not found.

                </h2>

            </div>

        );

    }

    if (loading) {

        return (

            <div className="container">

                <h2>

                    Creating payment...

                </h2>

            </div>

        );

    }

    return (

        <section className="payments-page">

            <div className="container">

                <div className="payment-card">

                    <h1>

                        Complete Payment

                    </h1>

                    <p>

                        Booking ID

                    </p>

                    <strong>

                        #{booking.bookingId}

                    </strong>

                    <p>

                        Amount

                    </p>

                    <strong>

                        ₹{payment.amount}

                    </strong>

                    <button>

                        Pay with Razorpay

                    </button>

                </div>

            </div>

        </section>

    );

}

export default Payments;