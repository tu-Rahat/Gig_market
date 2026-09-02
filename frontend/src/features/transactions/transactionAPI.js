import api from "../../services/api";


const getAuthConfig = () => {

    const token =
        localStorage.getItem("token");

    return {
        headers: {
            Authorization:
                `Bearer ${token}`
        }
    };

};


// Get transaction history
export const getTransactionHistory =
    async () => {

        const response =
            await api.get(
                "/transactions/history",
                getAuthConfig()
            );

        return response.data;

    };