import { useState } from "react";
import { deleteReview } from "../../../api/reviewApi";

export default function ReviewsOverview({ reviews, bookings, refreshReviews }) {

    async function handleDelete(id) {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteReview(id);
            refreshReviews();
        } catch (err) {
            console.error(err);
            alert("Failed to delete review.");
        }
    }

    return (
        <div>
            <div className="recent-bookings">
                {reviews.length === 0 ? (
                    <div className="empty-state">No reviews found.</div>
                ) : (
                    reviews.map(review => {
                        const booking = bookings.find(b => b.bookingId === review.bookingId);
                        return (
                            <div key={review.reviewId} className="booking-row" style={{ gridTemplateColumns: "1fr 1fr 2fr auto", alignItems: "center" }}>
                                <span>
                                    <strong>{booking?.serviceName || "Unknown Service"}</strong><br/>
                                    Cust: {booking?.customerName || "Unknown"}<br/>
                                    Part: {booking?.partnerName || "Unknown"}
                                </span>
                                <span className="payment-tag">{review.rating} ⭐</span>
                                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>"{review.comment}"</span>
                                <button className="cancel-btn" onClick={() => handleDelete(review.reviewId)}>Delete</button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
