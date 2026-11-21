import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true
});

// Automatically attach Bearer token from localStorage for all requests
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {
        // ignore storage access errors
    }
    return config;
}, (error) => Promise.reject(error));


export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");
        localStorage.removeItem("token");
        return response.data;
    } catch (err) {
        localStorage.removeItem("token");
        console.log(err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}