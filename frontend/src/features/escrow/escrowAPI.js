import api from "../../services/api";
const getAuthConfig = () => {
 const token = localStorage.getItem("token");
 return {
 headers: {
 Authorization: `Bearer ${token}`
 }
 };
};
export const getMyEscrows = async () => {
 const response = await api.get(
 "/escrow/mine",
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
