import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

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

            const response = await loginUser(formData);

            login(response);

            switch (response.role) {

                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "PARTNER":
                    navigate("/partner/dashboard");
                    break;

                default:
                    navigate("/customer/dashboard");
            }

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

        <div
            style={{
                maxWidth: "400px",
                margin: "80px auto"
            }}
        >

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                </div>

                <br />

                {error &&

                    <p style={{ color: "red" }}>
                        {error}
                    </p>

                }

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading ? "Logging in..." : "Login"}

                </button>

            </form>

        </div>

    );

}

export default Login;