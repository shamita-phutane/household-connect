import "./SubscriptionCard.css";

function SubscriptionCard({ plan }) {

    let badge = "";

    if (plan.planName === "Basic") {
        badge = "Starter";
    } else if (plan.planName === "Pro") {
        badge = "Most Popular";
    } else if (plan.planName === "Elite") {
        badge = "Best Value";
    }

    return (

        <div className="subscription-card">

            <span className="plan-badge">

                {badge}

            </span>

            <h3>

                {plan.planName}

            </h3>

            <div className="discount">

                {plan.discount}% OFF

            </div>

            <ul>

                <li>Priority Booking</li>

                <li>Discount on Every Service</li>

                <li>Verified Professionals</li>

                <li>24×7 Customer Support</li>

            </ul>

            <button>

                Choose Plan

            </button>

        </div>

    );

}

export default SubscriptionCard;