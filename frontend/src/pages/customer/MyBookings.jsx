import "./MyBookings.css";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { getCustomerBookings } from "../../api/bookingApi";

function MyBookings() {

    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadBookings() {

            try {

                const data = await getCustomerBookings(
                    user.userId
                );

                setBookings(data);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        }

        loadBookings();

    }, []);

    if (loading) {

        return (

            <div className="container">

                <h2>

                    Loading bookings...

                </h2>

            </div>

        );

    }

    return (

        <section className="my-bookings">

            <div className="container">

                <h1>

                    My Bookings

                </h1>

                <div className="booking-list">

                    {

                        bookings.map(booking => (

                            <div
                                key={booking.bookingId}
                                className="booking-card"
                            >

                                <div>

                                    <h3>

                                        {booking.serviceName}

                                    </h3>

                                    <p>

                                        {booking.date}

                                    </p>

                                </div>

                                <div>

                                    <span>

                                        {booking.status}

                                    </span>

                                </div>

                                <div>

                                    ₹{booking.finalAmount}

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default MyBookings;