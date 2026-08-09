import { FaHandPointer, FaCalendarAlt, FaDoorOpen } from "react-icons/fa";

function HowItWorks() {
    return (
        <section style={{ padding: "80px 0", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <div className="container" style={{ textAlign: "center" }}>
                <h2 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "15px" }}>How It Works</h2>
                <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto 50px", color: "var(--text-secondary)" }}>
                    Get your household chores done in three simple steps.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", alignItems: "start" }}>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "80px", height: "80px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                            <FaHandPointer />
                        </div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>1. Choose a Service</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Browse our wide range of services and pick exactly what you need help with.</p>
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "80px", height: "80px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                            <FaCalendarAlt />
                        </div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>2. Book a Time Slot</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Select a convenient date and time. We work around your busy schedule.</p>
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "80px", height: "80px", background: "rgba(79, 70, 229, 0.1)", color: "var(--accent-color)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                            <FaDoorOpen />
                        </div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>3. Get It Done</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>A verified professional will arrive at your doorstep and handle the rest.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
