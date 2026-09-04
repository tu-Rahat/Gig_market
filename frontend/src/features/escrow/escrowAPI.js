import api from "../../services/api";
const getAuthConfig = () => {
 return {};
};
export const getMyEscrows = async () => {
 const response = await api.get(
 "/escrow/mine",
 getAuthConfig()
 );
 return response.data;
};

export const getEligibleEscrowTasks = async () => {
    const response = await api.get(
        "/escrow/eligible-tasks",
        getAuthConfig()
    );
    return response.data;
};

export const getEscrowById = async (escrowId) => {
 const response = await api.get(
 `/escrow/${escrowId}`,
 getAuthConfig()
 );
 return response.data;
};
export const createEscrowHold = async (escrowData) => {
 const response = await api.post(
 "/escrow/hold",
 escrowData,
 getAuthConfig()
 );
 return response.data;
};

// Feature 19:
// Owner manually releases payment
export const releaseEscrowPayment = async (escrowId) => {
    const response = await api.patch(
        `/escrow/${escrowId}/release`,
        {},
        getAuthConfig()
    );

    return response.data;
};
