import { useEffect, useState } from "react";

import "./SubscriptionPlans.css";

import { getAllPlans } from "../../api/subscriptionApi";

import SubscriptionCard from "./SubscriptionCard";

function SubscriptionPlans() {

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadPlans() {

            try {

                const data = await getAllPlans();

                const filteredPlans = data.filter(plan =>
                    plan.planName === "Silver Plan" ||
                    plan.planName === "Gold Plan" ||
                    plan.planName === "Platinum Plan"
                );

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

    return (

        <section className="subscription-section">

            <div className="container">

                <h2 className="section-title">

                    Membership Plans

                </h2>

                <p className="section-subtitle">

                    Save more on every booking with exclusive membership benefits.

                </p>

                <div className="plans-grid">

                    {

                        plans.map(plan => (

                            <SubscriptionCard

                                key={plan.planId}

                                plan={plan}

                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default SubscriptionPlans;