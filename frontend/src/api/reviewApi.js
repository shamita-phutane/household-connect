import api from "./axios";

export async function createReview(data) {
    const response = await api.post("/reviews", data);
    return response.data;
}

export async function getReviewById(id) {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
}

export async function getReviewByBooking(bookingId) {
    const response = await api.get(`/reviews/booking/${bookingId}`);
    return response.data;
}

export async function getAllReviews() {
    const response = await api.get("/reviews");
    return response.data;
}

export async function deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
}
