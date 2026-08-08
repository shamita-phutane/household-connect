import api from "./axios";

export async function getCustomerBookings(customerId) {

    const response = await api.get(
        `/bookings/customer/${customerId}`
    );

    return response.data;

}

export async function getBookingById(id) {

    const response = await api.get(
        `/bookings/${id}`
    );

    return response.data;

}
export async function updateBookingStatus(id, status) {

    const response = await api.patch(
        `/bookings/${id}/status?status=${status}`
    );

    return response.data;

}
export async function createBooking(data) {

    const response = await api.post(

        "/bookings",

        data

    );

    return response.data;

}