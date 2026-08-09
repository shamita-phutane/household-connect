import api from "./axios";

export async function purchaseSubscription(data) {

    const response = await api.post(

        "/user-subscriptions",

        data

    );

    return response.data;

}

export async function getSubscriptionsByUser(userId) {

    const response = await api.get(

        `/user-subscriptions/user/${userId}`

    );

    return response.data;

}

export async function getSubscription(id) {

    const response = await api.get(

        `/user-subscriptions/${id}`

    );

    return response.data;

}

export async function verifySubscription(data) {
    const response = await api.post("/user-subscriptions/verify", data);
    return response.data;
}