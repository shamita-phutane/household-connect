import "./SubscriptionCard.css";

function SubscriptionCard({ plan, onChoosePlan }) {

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
                {plan.discount}% OFF Bookings
            </div>
            
            <div className="price" style={{ margin: "10px 0", fontSize: "1.2rem", fontWeight: "bold" }}>
                ₹{plan.price} / month
            </div>

            <ul>
                {plan.description && plan.description.split(',').map((perk, index) => (
                    <li key={index}>{perk.trim()}</li>
                ))}
            </ul>

            <button onClick={() => onChoosePlan(plan.planId)}>
                Choose Plan
            </button>

        </div>

    );

}

export default SubscriptionCard;