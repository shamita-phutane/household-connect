import { FaStar } from "react-icons/fa";

function Testimonials() {
    return (
        <section style={{ padding: "80px 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <h2 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "15px" }}>What Our Customers Say</h2>
                    <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto", color: "var(--text-secondary)" }}>
                        Don't just take our word for it. Here is what real users have experienced.
                    </p>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
                    <div style={{ background: "var(--background)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "5px", color: "#FBBF24", marginBottom: "15px", fontSize: "1.2rem" }}>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "20px", fontStyle: "italic" }}>
                            "Absolutely great service, very professional and on time. My AC was fixed within an hour and the pricing was super transparent."
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--accent-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                                AS
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "1rem" }}>Aman Sharma</h4>
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Mumbai</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: "var(--background)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "5px", color: "#FBBF24", marginBottom: "15px", fontSize: "1.2rem" }}>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "20px", fontStyle: "italic" }}>
                            "Quick and reliable booking! I needed a last-minute deep cleaning before a party and they delivered perfectly. Highly recommended."
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                                PR
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "1rem" }}>Priya Reddy</h4>
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Bangalore</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: "var(--background)", padding: "30px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "5px", color: "#FBBF24", marginBottom: "15px", fontSize: "1.2rem" }}>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "20px", fontStyle: "italic" }}>
                            "The subscription plan is totally worth it. I've saved thousands on plumbing and electrical repairs over the last few months."
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                                VK
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "1rem" }}>Vikram Kumar</h4>
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Delhi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
