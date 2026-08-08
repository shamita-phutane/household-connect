import api from "./axios";

export async function createPayment(data) {

    const response = await api.post(

        "/payments/create-order",

        data

    );

    return response.data;

}

export async function verifyPayment(data) {

    const response = await api.post(

        "/payments/verify",

        data

    );

    return response.data;

}

export async function getPaymentByBooking(bookingId) {

    const response = await api.get(

        `/payments/booking/${bookingId}`

    );

    return response.data;

}

export async function getRazorpayKey() {

    const response = await api.get(

        "/payments/razorpay-key"

    );

    return response.data;

}
