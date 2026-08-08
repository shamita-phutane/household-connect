import api from "./axios";

export async function getAllPlans() {

    const response = await api.get("/subscription-plans");

    return response.data;

}   