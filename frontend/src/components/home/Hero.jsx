import "./Hero.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices } from "../../api/servicesApi";

function Hero() {

    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadServices() {

            try {

                const data = await getAllServices();
                setServices(data);

            } catch (error) {

                console.error(error);

            }

        }

        loadServices();

    }, []);

    const filteredServices = search
        ? services.filter(service =>
              service.svcName.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    function handleServiceClick() {

        document
            .getElementById("services")
            ?.scrollIntoView({
                behavior: "smooth"
            });

        setSearch("");

    }

    return (

        <section className="hero">

            <div className="container hero-container">

                <div className="hero-left">

                    <span className="hero-tag">

                        Trusted Home Services

                    </span>

                    <h1>

                        Professional home services,
                        <br />
                        without the hassle.

                    </h1>

                    <p>

                        Book verified professionals for cleaning,
                        appliance repair, plumbing, electrical work,
                        beauty services and much more.

                    </p>

                    <div style={{ display: "flex", gap: "15px", marginTop: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
                        <Link to="/services" className="primary-btn" style={{ padding: "14px 28px", fontSize: "16px" }}>
                            Book a Service
                        </Link>
                        <Link to="/plans" className="secondary-btn" style={{ padding: "14px 28px", fontSize: "16px" }}>
                            Explore Plans
                        </Link>
                    </div>

                    <div className="hero-search">

                        <input
                            type="text"
                            placeholder="Search for a service..."
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />

                    </div>

                    {

                        search &&

                        <div className="search-results">

                            {

                                filteredServices.length>0

                                ?

                                filteredServices.map(service=>(

                                    <div
                                        key={service.serviceId}
                                        className="search-item"
                                        onClick={handleServiceClick}
                                    >

                                        <span>

                                            {service.svcName}

                                        </span>

                                        <strong>

                                            ₹{service.basePrice}

                                        </strong>

                                    </div>

                                ))

                                :

                                <div className="search-empty">

                                    No service found.

                                </div>

                            }

                        </div>

                    }

                </div>

                <div className="hero-right">

                    <div className="stat-card large">

                        <small>

                            MOST BOOKED

                        </small>

                        <h3>

                            Deep House Cleaning

                        </h3>

                        <span>

                            ₹1299

                        </span>

                    </div>

                    <div className="mini-grid">

                        <div className="stat-card">

                            ⭐

                            <h4>

                                4.9 Rating

                            </h4>

                        </div>

                        <div className="stat-card">

                            👨‍🔧

                            <h4>

                                Verified Partners

                            </h4>

                        </div>

                        <div className="stat-card">

                            ⚡

                            <h4>

                                Instant Booking

                            </h4>

                        </div>

                        <div className="stat-card">

                            🛡️

                            <h4>

                                Secure Payments

                            </h4>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;