import "./Footer.css";

import { Link } from "react-router-dom";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter
} from "react-icons/fa";

function Footer() {

    return (

        <footer className="footer">

            <div className="container footer-grid">

                <div className="footer-brand">

                    <h2>

                        🏠 Household Connect

                    </h2>

                    <p>

                        Trusted professionals for every home service.
                        Book cleaning, plumbing, electrical, appliance
                        repair and much more with confidence.

                    </p>

                    <div className="footer-socials">

                        <a href="#">

                            <FaFacebookF />

                        </a>

                        <a href="#">

                            <FaInstagram />

                        </a>

                        <a href="#">

                            <FaTwitter />

                        </a>

                        <a href="#">

                            <FaLinkedinIn />

                        </a>

                    </div>

                </div>

                <div>

                    <h4>

                        Services

                    </h4>

                    <ul>

                        <li>Cleaning</li>

                        <li>Electrical</li>

                        <li>Plumbing</li>

                        <li>Painting</li>

                        <li>Salon at Home</li>

                    </ul>

                </div>

                <div>

                    <h4>

                        Company

                    </h4>

                    <ul>

                        <li>

                            <Link to="/">

                                Home

                            </Link>

                        </li>

                        <li>

                            <Link to="/about">

                                About

                            </Link>

                        </li>

                        <li>

                            <Link to="/plans">

                                Membership

                            </Link>

                        </li>

                    </ul>

                </div>

                <div>

                    <h4>

                        Contact

                    </h4>

                    <ul>

                        <li>

                            support@householdconnect.com

                        </li>

                        <li>

                            +91 98765 43210

                        </li>

                        <li>

                            Pune, Maharashtra

                        </li>

                    </ul>

                </div>

            </div>

            <div className="footer-bottom">

                © 2026 Household Connect. All rights reserved.

            </div>

        </footer>

    );

}

export default Footer;