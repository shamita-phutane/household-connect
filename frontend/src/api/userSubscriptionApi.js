import api from "./axios";

export async function purchaseSubscription(data) {

    const response = await api.post(

        "/api/user-subscriptions",

        data

    );

    return response.data;

}

export async function getSubscriptionsByUser(userId) {

    const response = await api.get(

        `/api/user-subscriptions/user/${userId}`

    );

    return response.data;

}

export async function getSubscription(id) {

    const response = await api.get(

        `/api/user-subscriptions/${id}`

    );

    return response.data;

}