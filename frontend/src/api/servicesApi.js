import axiosInstance from "./axios";

export async function getAllServices() {

    const response = await axiosInstance.get("/services");

    return response.data;

}