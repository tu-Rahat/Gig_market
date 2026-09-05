import api from "../../services/api";

export const getConversationMessages = async (taskId, bidId) => {
    const response = await api.get(
        `/messages/task/${taskId}/bid/${bidId}`
    );
    return response.data;
};

export const sendConversationMessage = async (
    taskId,
    bidId,
    message
) => {
    const response = await api.post(
        `/messages/task/${taskId}/bid/${bidId}`,
        { message }
    );
    return response.data;
};