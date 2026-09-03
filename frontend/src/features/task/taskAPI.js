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

export const getMyTasks = async () => {
    const response = await api.get("/tasks/mine");
    return response.data;
};

export const getMySelectionHistory = async () => {
    const response = await api.get("/tasks/selection-history");
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response.data;
};

export const cancelTask = async (taskId) => {
    const response = await api.patch(`/tasks/${taskId}/cancel`);
    return response.data;
};
