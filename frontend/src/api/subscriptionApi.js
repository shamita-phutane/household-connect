import api from "./axios";

export async function getAllPlans() {

    const response = await api.get("/subscriptions");

    return response.data;

}   