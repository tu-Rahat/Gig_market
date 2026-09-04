import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use(
    (config) => {
        if (typeof FormData !== "undefined" && config.data instanceof FormData) {
            if (typeof config.headers?.delete === "function") {
                config.headers.delete("Content-Type");
                config.headers.delete("content-type");
            } else if (config.headers) {
                delete config.headers["Content-Type"];
                delete config.headers["content-type"];
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;