import "./Navbar.css";

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiX } from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {

        logout();

        navigate("/login");

        setMenuOpen(false);

    }

    function closeMenu() {

        setMenuOpen(false);

    }

    return (

        <header className="navbar">

            <div className="container navbar-container">

                <Link
                    to="/"
                    className="logo"
                >
                    🏠 Household Connect
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >

                    {

                        menuOpen

                            ?

                            <HiX />

                            :

                            <HiOutlineMenu />

                    }

                </button>

                <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

                    <NavLink to="/" onClick={closeMenu}>
                        Home
                    </NavLink>

                    <a href="#services" onClick={closeMenu}>
                        Services
                    </a>

                    <a href="#plans" onClick={closeMenu}>
                        Plans
                    </a>

                    <a href="#about" onClick={closeMenu}>
                        About
                    </a>

                    {

                        !user

                        ?

                        <>

                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={closeMenu}
                            >

                                <Button>

                                    Get Started

                                </Button>

                            </Link>

                        </>

                        :

                        <>

                            {user?.role === "CUSTOMER" && (
                                <Link to="/my-bookings" onClick={closeMenu}>
                                    My Bookings
                                </Link>
                            )}

                            <span className="welcome-text">

                                Hi, {user.name}

                            </span>

                            <Button
                                variant="outline"
                                onClick={handleLogout}
                            >

                                Logout

                            </Button>

                        </>

                    }

                </nav>

            </div>

        </header>

    );

}

export default Navbar;