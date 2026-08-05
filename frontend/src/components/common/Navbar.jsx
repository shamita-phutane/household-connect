import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 40px",
                borderBottom: "1px solid #ddd"
            }}
        >

            <h2>Household Connect</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center"
                }}
            >

                <Link to="/">Home</Link>

                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user && (
                    <>
                        <span>
                            Welcome, {user.name}
                        </span>

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>

    );

}

export default Navbar;