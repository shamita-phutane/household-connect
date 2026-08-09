import { Link } from "react-router-dom";
import HowItWorks from "../../components/home/HowItWorks";
import { FaCheckCircle, FaCalendarCheck, FaTags, FaLock, FaUserTie, FaBolt, FaHeart, FaPiggyBank } from "react-icons/fa";
import Footer from "../../components/common/Footer";

function About() {
    return (
        <div style={{ background: "var(--background)" }}>
            
            {/* 1. HERO / INTRO SECTION */}
            <section style={{ padding: "100px 20px 80px", textAlign: "center", background: "var(--surface)" }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <span style={{ color: "var(--accent-color)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Our Story</span>
                    <h1 style={{ fontSize: "3rem", fontWeight: "800", marginTop: "15px", marginBottom: "25px", letterSpacing: "-1px" }}>About Household Connect</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", lineHeight: "1.8", maxWidth: "650px", margin: "0 auto" }}>
                        We are a trusted home services platform designed to connect busy homeowners with skilled, verified professionals. 
                        We take the stress out of household maintenance by providing a seamless, one-stop booking experience.
                    </p>
                </div>
            </section>

            {/* 2. OUR MISSION */}
            <section style={{ padding: "80px 20px" }}>
                <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
                    <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Our Mission</h2>
                    <p style={{ fontSize: "1.3rem", fontWeight: "500", color: "var(--primary-color)", lineHeight: "1.6", fontStyle: "italic", background: "var(--surface)", padding: "40px", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "var(--box-shadow-sm)" }}>
                        "To make home services simple, reliable, and accessible for everyone."
                    </p>
                </div>
            </section>

            {/* 3. WHAT WE OFFER */}
            <section style={{ padding: "80px 20px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h2 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>What We Offer</h2>
                        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>Everything you need for a stress-free home service experience.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px" }}>
                        <div style={{ padding: "30px", background: "var(--background)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
                            <FaCheckCircle style={{ fontSize: "40px", color: "var(--success)", marginBottom: "20px" }} />
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Verified Professionals</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Every partner is thoroughly vetted for your safety.</p>
                        </div>
                        <div style={{ padding: "30px", background: "var(--background)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
                            <FaCalendarCheck style={{ fontSize: "40px", color: "var(--accent-color)", marginBottom: "20px" }} />
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Easy Booking</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Book any service in just a few clicks.</p>
                        </div>
                        <div style={{ padding: "30px", background: "var(--background)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
                            <FaTags style={{ fontSize: "40px", color: "#F59E0B", marginBottom: "20px" }} />
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Transparent Pricing</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>No hidden fees or surprise charges.</p>
                        </div>
                        <div style={{ padding: "30px", background: "var(--background)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
                            <FaLock style={{ fontSize: "40px", color: "#10B981", marginBottom: "20px" }} />
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Secure Payments</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Safe and encrypted payment processing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WHY CHOOSE US */}
            <section style={{ padding: "80px 20px" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h2 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>Why Choose Us</h2>
                        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>We go above and beyond to deliver the best experience.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                            <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                <FaUserTie />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Trusted Experts</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>We only onboard the top 5% of skilled professionals.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                            <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                <FaBolt />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Quick Turnaround</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Fast response times and rapid service completion.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                            <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                <FaHeart />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Customer-First</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Your satisfaction is our absolute highest priority.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                            <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                <FaPiggyBank />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Affordable Pricing</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Premium service quality that won't break the bank.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <HowItWorks />

            {/* 6. JOIN AS A PARTNER */}
            <section style={{ padding: "80px 20px" }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div style={{ background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%)", padding: "50px", borderRadius: "24px", textAlign: "center", border: "1px solid var(--border)", boxShadow: "var(--box-shadow)" }}>
                        <h2 style={{ fontSize: "2.2rem", marginBottom: "15px", fontWeight: "700" }}>Earn with us</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto" }}>
                            Join our network of trusted service partners, manage your own schedule, and grow your business today.
                        </p>
                        <Link to="/register?role=partner" className="primary-btn" style={{ textDecoration: "none", display: "inline-block", padding: "16px 36px", fontSize: "1.1rem" }}>
                            Join as Partner
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. FOOTER CONNECTION */}
            <Footer />

        </div>
    );
}

export default About;
