import axiosInstance from "./axios";

export async function getAllServices() {

    const response = await axiosInstance.get("/services");

    return response.data;

}

export async function createService(data) {
    const response = await axiosInstance.post("/services", data);
    return response.data;
}

export async function updateService(id, data) {
    const response = await axiosInstance.put(`/services/${id}`, data);
    return response.data;
}

export async function deleteService(id) {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
}