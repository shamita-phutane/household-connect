import { FaUserShield, FaRupeeSign, FaClock, FaHeadset } from "react-icons/fa";

function WhyChooseUs() {
    return (
        <section style={{ padding: "80px 0", background: "var(--background)", borderTop: "1px solid var(--border)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <h2 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "15px" }}>Why Choose Us</h2>
                    <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto", color: "var(--text-secondary)" }}>
                        We pride ourselves on delivering premium quality and ensuring complete peace of mind.
                    </p>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
                    <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{ width: "50px", height: "50px", minWidth: "50px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            <FaUserShield />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Verified Experts</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Every professional undergoes rigorous background checks and skills verification.</p>
                        </div>
                    </div>
                    
                    <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{ width: "50px", height: "50px", minWidth: "50px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            <FaRupeeSign />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Transparent Pricing</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>No hidden fees. You know exactly what you are paying for before you book.</p>
                        </div>
                    </div>

                    <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{ width: "50px", height: "50px", minWidth: "50px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            <FaClock />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>On-time Service</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>We respect your time. Our partners are committed to arriving precisely on schedule.</p>
                        </div>
                    </div>

                    <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        <div style={{ width: "50px", height: "50px", minWidth: "50px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            <FaHeadset />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>24/7 Support</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Our customer support team is always ready to assist you with any questions or issues.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
