import { useEffect, useState } from "react";

import "./SubscriptionPlans.css";

import { getAllPlans } from "../../api/subscriptionApi";
import { purchaseSubscription, verifySubscription } from "../../api/userSubscriptionApi";
import { getRazorpayKey } from "../../api/paymentApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import SubscriptionCard from "./SubscriptionCard";

function SubscriptionPlans() {

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        async function loadPlans() {

            try {

                const data = await getAllPlans();

                const filteredPlans = data.filter(plan =>
                    plan.planName === "Basic" ||
                    plan.planName === "Pro" ||
                    plan.planName === "Elite"
                );

                console.log(filteredPlans);
                setPlans(filteredPlans);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadPlans();

    }, []);

    if (loading) {
        return null;
    }

    async function handleChoosePlan(planId) {
        if (!user) {
            navigate("/login");
            return;
        }

        setProcessing(true);
        setErrorMsg("");

        try {
            const planDetails = plans.find(p => p.planId === planId);
            const [subscriptionData, razorpayConfig] = await Promise.all([
                purchaseSubscription({ userId: user.userId, planId: planId }),
                getRazorpayKey()
            ]);

            if (!window.Razorpay) {
                setErrorMsg("Payment gateway failed to load. Please refresh.");
                setProcessing(false);
                return;
            }

            const checkout = new window.Razorpay({
                key: razorpayConfig.keyId,
                amount: Math.round(planDetails.price * 100),
                currency: "INR",
                order_id: subscriptionData.razorpayOrderId,
                name: "Household Connect",
                description: `Subscription: ${planDetails.planName}`,
                prefill: {
                    name: user.name,
                    email: user.email
                },
                theme: { color: "#c6a15b" },
                handler: async function (response) {
                    try {
                        await verifySubscription({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        alert("Subscription activated successfully!");
                        navigate("/customer/dashboard");
                    } catch (err) {
                        console.error(err);
                        setErrorMsg("Payment verified but failed to activate subscription.");
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
                setErrorMsg("Payment failed: " + response.error.description);
                setProcessing(false);
            });

            checkout.open();

        } catch (error) {
            console.error(error);
            setErrorMsg("Failed to initiate subscription purchase.");
            setProcessing(false);
        }
    }

    return (

        <section id="plans" className="subscription-section">

            <div className="container">

                <h2 className="section-title">
                    Membership Plans
                </h2>
                <p className="section-subtitle">
                    Save more on every booking with exclusive membership benefits.
                </p>
                {errorMsg && <p style={{color: 'red', textAlign: 'center'}}>{errorMsg}</p>}
                {processing && <p style={{textAlign: 'center'}}>Processing payment...</p>}
                
                <div className="plans-grid">

                    {

                        plans.map(plan => (

                            <SubscriptionCard
                                key={plan.planId}
                                plan={plan}
                                onChoosePlan={handleChoosePlan}
                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default SubscriptionPlans;