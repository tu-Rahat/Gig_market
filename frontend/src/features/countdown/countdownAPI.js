import api from "../../services/api";
const getAuthConfig = () => {
 return {};
};
export const getTaskCountdown = async (escrowId) => {
 const response = await api.get(
 `/countdowns/${escrowId}`,
 getAuthConfig()
 );
 return response.data;
};