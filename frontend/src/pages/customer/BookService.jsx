import "./BookService.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getAllServices } from "../../api/servicesApi";
import { createBooking } from "../../api/bookingApi";

function BookService() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({

        serviceId: "",

        date: "",

        bookingTime: "",

        serviceAddress: ""

    });

    useEffect(() => {

        async function loadServices() {

            try {

                const data = await getAllServices();

                setServices(data);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        }

        loadServices();

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

        setSubmitting(true);

        try {

            const booking = {

                customerId: user.userId,

                serviceId: Number(formData.serviceId),

                date: formData.date,

                bookingTime: formData.bookingTime,

                serviceAddress: formData.serviceAddress

            };

            const createdBooking = await createBooking(booking);

            navigate("/customer/payments", {

                state: {

                    booking: createdBooking

                }

            });

        }

        catch (error) {

            console.error(error);

            alert("Booking failed.");

        }

        finally {

            setSubmitting(false);

        }

    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <section className="book-service">

            <div className="container">

                <h1>

                    Book a Service

                </h1>

                <form

                    className="booking-form"

                    onSubmit={handleSubmit}

                >

                    <select

                        name="serviceId"

                        value={formData.serviceId}

                        onChange={handleChange}

                        required

                    >

                        <option value="">

                            Select Service

                        </option>

                        {

                            services.map(service => (

                                <option

                                    key={service.serviceId}

                                    value={service.serviceId}

                                >

                                    {service.svcName} - ₹{service.basePrice}

                                </option>

                            ))

                        }

                    </select>

                    <input

                        type="date"

                        name="date"

                        value={formData.date}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="time"

                        name="bookingTime"

                        value={formData.bookingTime}

                        onChange={handleChange}

                        required

                    />

                    <textarea

                        rows="4"

                        name="serviceAddress"

                        placeholder="Enter Service Address"

                        value={formData.serviceAddress}

                        onChange={handleChange}

                        required

                    />

                    <button

                        type="submit"

                        disabled={submitting}

                    >

                        {

                            submitting

                                ?

                                "Creating Booking..."

                                :

                                "Continue to Payment"

                        }

                    </button>

                </form>

            </div>

        </section>

    );

}

export default BookService;