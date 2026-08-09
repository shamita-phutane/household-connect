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
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <img 
                        src="/logo-new.png" 
                        alt="Household Connect" 
                        style={{ height: "52px", width: "auto", objectFit: "contain", transform: "scale(1.1)" }} 
                    />
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

                    <Link to="/services" onClick={closeMenu}>
                        Services
                    </Link>

                    <Link to="/plans" onClick={closeMenu}>
                        Plans
                    </Link>

                    <Link to="/about" onClick={closeMenu}>
                        About
                    </Link>

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
                            
                            {user?.role === "PARTNER" && (
                                <Link to="/partner/dashboard" onClick={closeMenu}>
                                    Partner Dashboard
                                </Link>
                            )}

                            {user?.role === "ADMIN" && (
                                <Link to="/admin/dashboard" onClick={closeMenu}>
                                    Admin Dashboard
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