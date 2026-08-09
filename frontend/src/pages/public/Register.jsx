import "./Register.css";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../../services/authService";
import { getAllServices } from "../../api/servicesApi";

function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const initialRole = searchParams.get("role") === "partner" ? "PARTNER" : "CUSTOMER";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        role: initialRole,
        serviceId: "",
        experienceYears: ""
    });

    useEffect(() => {
        getAllServices()
            .then(data => setServices(data))
            .catch(err => console.error("Failed to load services", err));
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        
        // Transform serviceId and experience to numbers if PARTNER
        const submitData = { ...formData };
        if (submitData.role === "PARTNER") {
            if (!submitData.serviceId) {
                setError("Please select a service to offer.");
                setLoading(false);
                return;
            }
            submitData.serviceId = parseInt(submitData.serviceId, 10);
            if (submitData.experienceYears) {
                submitData.experienceYears = parseInt(submitData.experienceYears, 10);
            } else {
                submitData.experienceYears = null; // optional
            }
        }

        try {
            await register(submitData);
            alert("Registration successful.");
            navigate("/login");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Unable to connect to server.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join Household Connect and book trusted professionals.</p>
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-field">
                        <label style={{ display: "block", marginBottom: "10px" }}>I want to join as a:</label>
                        <div className="role-cards-container">
                            <div 
                                className={`role-card ${formData.role === 'CUSTOMER' ? 'selected' : ''}`}
                                onClick={() => setFormData({...formData, role: 'CUSTOMER'})}
                            >
                                <div className="role-icon">👤</div>
                                <div className="role-title">Customer</div>
                                <div className="role-desc">Book services</div>
                            </div>
                            <div 
                                className={`role-card ${formData.role === 'PARTNER' ? 'selected' : ''}`}
                                onClick={() => setFormData({...formData, role: 'PARTNER'})}
                            >
                                <div className="role-icon">🛠️</div>
                                <div className="role-title">Partner</div>
                                <div className="role-desc">Offer services</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>

                    {formData.role === "PARTNER" && (
                        <>
                            <div className="form-field">
                                <label>Service You Offer (Required)</label>
                                <select name="serviceId" value={formData.serviceId} onChange={handleChange} required>
                                    <option value="">-- Select a Service --</option>
                                    {services.map(s => (
                                        <option key={s.serviceId} value={s.serviceId}>{s.svcName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Experience (Years)</label>
                                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} min="0" />
                            </div>
                        </>
                    )}

                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;