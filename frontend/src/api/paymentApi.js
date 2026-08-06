import api from "./axios";

export async function createPayment(data) {

    const response = await api.post(

        "/api/payments/create-order",

        data

    );

    return response.data;

}

export async function getPaymentByBooking(bookingId) {

    const response = await api.get(

        `/api/payments/booking/${bookingId}`

    );

    return response.data;

}