import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./FeaturedServices.css";

import { getAllServices } from "../../api/servicesApi";
import ServiceCard from "../service/ServiceCard";

function FeaturedServices({ showAll = false }) {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function fetchServices() {

            try {

                const data = await getAllServices();

                console.log(data);
                setServices(showAll ? data : data.slice(0, 6));

            } catch (err) {

                console.error(err);

                setError("Unable to load services.");

            } finally {

                setLoading(false);

            }

        }

        fetchServices();

    }, [showAll]);

    if (loading) {

        return (

            <section className="featured-services">

                <div className="container">

                    <h2 className="section-title">

                        {showAll ? "All Services" : "Popular Services"}

                    </h2>

                    <p>Loading...</p>

                </div>

            </section>

        );

    }

    if (error) {

        return (

            <section className="featured-services">

                <div className="container">

                    <h2 className="section-title">

                        {showAll ? "All Services" : "Popular Services"}

                    </h2>

                    <p>{error}</p>

                </div>

            </section>

        );

    }

    return (

        <section
            id="services"
            className="featured-services"
        >

            <div className="container">

                <div className="section-header">

                    <div>

                        <h2 className="section-title">

                            {showAll ? "All Services" : "Popular Services"}

                        </h2>

                        <p className="section-subtitle">

                            Trusted professionals for your everyday home needs.

                        </p>

                    </div>

                    {!showAll && (
                        <Link
                            to="/services"
                            className="view-all-btn"
                        >
                            View All →
                        </Link>
                    )}

                </div>

                <div className="services-grid">

                    {

                        services.map(service=>(

                            <ServiceCard
                                key={service.serviceId}
                                service={service}
                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default FeaturedServices;