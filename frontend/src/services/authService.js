import api from "../api/axios";

export async function login(credentials) {

    const response = await api.post(

        "/auth/login",

        credentials

    );

    return response.data;

}

export async function register(userData) {

    const response = await api.post(

        "/users",

        userData

    );

    return response.data;

}