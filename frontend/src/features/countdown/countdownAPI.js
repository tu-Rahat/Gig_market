import api from "../../services/api";
const getAuthConfig = () => {
 const token = localStorage.getItem("token");
 return {
 headers: {
 Authorization: `Bearer ${token}`
 }
 };
};
export const getTaskCountdown = async (escrowId) => {
 const response = await api.get(
 `/countdowns/${escrowId}`,
 getAuthConfig()
 );
 return response.data;
};