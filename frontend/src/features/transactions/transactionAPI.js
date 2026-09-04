import api from "../../services/api";


const getAuthConfig = () => {
    return {};
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