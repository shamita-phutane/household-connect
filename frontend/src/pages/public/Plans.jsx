import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";
import Footer from "../../components/common/Footer";

function Plans() {
    return (
        <div style={{ background: "var(--background)" }}>
            <div style={{ paddingTop: '20px', minHeight: '80vh' }}>
                <SubscriptionPlans />
            </div>
            <Footer />
        </div>
    );
}

export default Plans;
