import "./Register.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/authService";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        phone: "",

        city: "",

        role: "CUSTOMER"

    });

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

        try {

            await register(formData);

            alert("Registration successful.");

            navigate("/login");

        }

        catch (error) {

            if (error.response) {

                setError(error.response.data.message);

            }

            else {

                setError("Unable to connect to server.");

            }

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>

                    Create Account

                </h1>

                <p className="auth-subtitle">

                    Join Household Connect and book trusted professionals.

                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-field">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>Phone</label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>City</label>

                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {error &&

                        <p className="auth-error">

                            {error}

                        </p>

                    }

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {

                            loading

                                ? "Creating Account..."

                                : "Register"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Register;