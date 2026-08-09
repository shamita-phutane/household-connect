import api from "./axios";

export async function getAllUsers() {
    const response = await api.get("/users");
    return response.data;
}

export async function deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
}

export async function getPartnersByService(serviceId) {
    const response = await api.get(`/partners/by-service/${serviceId}`);
    return response.data;
}
