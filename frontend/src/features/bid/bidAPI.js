import api from "../../services/api";

export const submitBid = async (taskId, bidData) => {
    const response = await api.post(`/bids/task/${taskId}`, bidData);
    return response.data;
};

export const getBidSummary = async (taskId) => {
    const response = await api.get(`/bids/task/${taskId}/summary`);
    return response.data;
};

export const getOwnerTaskBids = async (taskId) => {
    const response = await api.get(`/bids/task/${taskId}/owner`);
    return response.data;
};