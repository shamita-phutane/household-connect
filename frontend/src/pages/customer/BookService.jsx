import "./BookService.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getAllServices } from "../../api/servicesApi";
import { createBooking } from "../../api/bookingApi";

function todayIsoDate() {

    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;

}

function formatCategory(category) {

    return category
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}

function BookService() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadError, setLoadError] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({

        serviceId: "",

        date: "",

        bookingTime: "",

        serviceAddress: ""

    });

    const minDate = todayIsoDate();

    useEffect(() => {

        async function loadServices() {

            try {

                const data = await getAllServices();

                setServices(data);

            }

            catch (error) {

                console.error(error);

                setLoadError("Unable to load services right now. Please try again shortly.");

            }

            finally {

                setLoading(false);

            }

        }

        loadServices();

    }, []);

    const selectedService = useMemo(

        () => services.find(
            service => String(service.serviceId) === String(formData.serviceId)
        ),

        [services, formData.serviceId]

    );

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData(previous => ({

            ...previous,

            [name]: value

        }));

        setFieldErrors(previous => ({

            ...previous,

            [name]: ""

        }));

    }

    function validate() {

        const errors = {};

        if (!formData.serviceId) {
            errors.serviceId = "Please select a service.";
        }

        if (!formData.date) {
            errors.date = "Please choose a date.";
        }
        else if (formData.date < minDate) {
            errors.date = "Date cannot be in the past.";
        }

        if (!formData.bookingTime) {
            errors.bookingTime = "Please choose a time.";
        }

        if (!formData.serviceAddress.trim()) {
            errors.serviceAddress = "Please enter the service address.";
        }
        else if (formData.serviceAddress.trim().length < 10) {
            errors.serviceAddress = "Address looks too short — add more detail.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;

    }

    async function handleSubmit(event) {

        event.preventDefault();

        setSubmitError("");

        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {

            const booking = {

                customerId: user.userId,

                serviceId: Number(formData.serviceId),

                date: formData.date,

                bookingTime: formData.bookingTime,

                serviceAddress: formData.serviceAddress.trim()

            };

            const createdBooking = await createBooking(booking);

            navigate(`/customer/payments/${createdBooking.bookingId}`);

        }

        catch (error) {

            console.error(error);

            if (error.response) {
                setSubmitError(error.response.data.message || "Booking failed. Please try again.");
            }
            else {
                setSubmitError("Unable to connect to server.");
            }

        }

        finally {

            setSubmitting(false);

        }

    }

    if (loading) {

        return (

            <section className="book-service">

                <div className="container">

                    <h2>Loading services...</h2>

                </div>

            </section>

        );

    }

    if (loadError) {

        return (

            <section className="book-service">

                <div className="container">

                    <h2>{loadError}</h2>

                </div>

            </section>

        );

    }

    return (

        <section className="book-service">

            <div className="container">

                <h1>

                    Book a Service

                </h1>

                <p className="book-service-subtitle">

                    Choose a service, pick a slot and tell us where to come. You'll review the price before paying.

                </p>

                <div className="book-service-layout">

                    <form

                        className="booking-form"

                        onSubmit={handleSubmit}
                        noValidate

                    >

                        <div className="form-field">

                            <label>Service</label>

                            <select

                                name="serviceId"

                                value={formData.serviceId}

                                onChange={handleChange}

                            >

                                <option value="">

                                    Select a service

                                </option>

                                {

                                    services.map(service => (

                                        <option

                                            key={service.serviceId}

                                            value={service.serviceId}

                                        >

                                            {service.svcName} — ₹{service.basePrice}

                                        </option>

                                    ))

                                }

                            </select>

                            {fieldErrors.serviceId &&
                                <span className="field-error">{fieldErrors.serviceId}</span>
                            }

                        </div>

                        <div className="form-row">

                            <div className="form-field">

                                <label>Date</label>

                                <input

                                    type="date"

                                    name="date"

                                    min={minDate}

                                    value={formData.date}

                                    onChange={handleChange}

                                />

                                {fieldErrors.date &&
                                    <span className="field-error">{fieldErrors.date}</span>
                                }

                            </div>

                            <div className="form-field">

                                <label>Time</label>

                                <input

                                    type="time"

                                    name="bookingTime"

                                    value={formData.bookingTime}

                                    onChange={handleChange}

                                />

                                {fieldErrors.bookingTime &&
                                    <span className="field-error">{fieldErrors.bookingTime}</span>
                                }

                            </div>

                        </div>

                        <div className="form-field">

                            <label>Service Address</label>

                            <textarea

                                rows="4"

                                name="serviceAddress"

                                placeholder="House / flat number, street, area, city"

                                value={formData.serviceAddress}

                                onChange={handleChange}

                            />

                            {fieldErrors.serviceAddress &&
                                <span className="field-error">{fieldErrors.serviceAddress}</span>
                            }

                        </div>

                        {submitError &&

                            <p className="form-error">

                                {submitError}

                            </p>

                        }

                        <button

                            type="submit"

                            disabled={submitting}

                        >

                            {

                                submitting
                                    ? "Creating Booking..."
                                    : "Continue to Payment"

                            }

                        </button>

                    </form>

                    <aside className="booking-summary">

                        <h3>Booking Summary</h3>

                        {

                            selectedService

                                ?

                                <>

                                    <span className="summary-category">
                                        {formatCategory(selectedService.category)}
                                    </span>

                                    <h4>{selectedService.svcName}</h4>

                                    <p>{selectedService.description}</p>

                                    <div className="summary-price">

                                        <span>Base Price</span>

                                        <strong>₹{selectedService.basePrice}</strong>

                                    </div>

                                    <p className="summary-note">
                                        Any active membership discount will be applied automatically at checkout.
                                    </p>

                                </>

                                :

                                <p className="summary-empty">
                                    Select a service to see the price here.
                                </p>

                        }

                    </aside>

                </div>

            </div>

        </section>

    );

}

export default BookService;
