import api from "./axios";

export async function getCustomerBookings(customerId) {

    const response = await api.get(
        `/api/bookings/customer/${customerId}`
    );

    return response.data;

}

export async function getBookingById(id) {

    const response = await api.get(
        `/api/bookings/${id}`
    );

    return response.data;

}
export async function updateBookingStatus(id, status) {

    const response = await api.patch(
        `/api/bookings/${id}/status?status=${status}`
    );

    return response.data;

}
export async function createBooking(data) {

    const response = await api.post(

        "/api/bookings",

        data

    );

    return response.data;

}