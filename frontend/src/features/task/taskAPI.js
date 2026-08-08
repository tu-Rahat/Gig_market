import api from "../../services/api";

export const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
};

export const getTasks = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

export const getTaskById = async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
};