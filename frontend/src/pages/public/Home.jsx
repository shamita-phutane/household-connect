import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import FeaturedServices from "../../components/home/FeaturedServices";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";
import Testimonials from "../../components/home/Testimonials";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <Hero />
            <HowItWorks />
            <FeaturedServices />
            <WhyChooseUs />
            <SubscriptionPlans />
            <Testimonials />
            
            <section style={{ padding: "80px 20px", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div style={{ background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%)", padding: "50px", borderRadius: "24px", textAlign: "center", border: "1px solid var(--border)", boxShadow: "var(--box-shadow)" }}>
                        <h2 style={{ fontSize: "2.2rem", marginBottom: "15px", fontWeight: "700" }}>Earn with Household Connect</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 30px" }}>
                            Are you a professional? Join our network of trusted service partners, manage your own schedule, and grow your business today.
                        </p>
                        <Link to="/register?role=partner" className="primary-btn" style={{ textDecoration: "none", display: "inline-block", padding: "16px 36px", fontSize: "1.1rem" }}>
                            Join as Partner
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Home;