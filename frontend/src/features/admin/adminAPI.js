import api from "../../services/api";


const getAdminToken = () => {
    return localStorage.getItem(
        "adminToken"
    );
};


const getAdminConfig = () => {
    return {
        headers: {
            Authorization:
                `Bearer ${getAdminToken()}`
        }
    };
};


export const loginAdmin = async (
    email,
    password
) => {

    const response = await api.post(
        "/admin/login",
        {
            email,
            password
        }
    );

    return response.data;
};


export const getPendingCredentials =
    async () => {

        const response = await api.get(
            "/admin/credentials/pending",
            getAdminConfig()
        );

        return response.data;
    };


export const approveCredential =
    async (
        credentialId
    ) => {

        const response = await api.patch(
            `/admin/credentials/${credentialId}/approve`,
            {},
            getAdminConfig()
        );

        return response.data;
    };


export const rejectCredential =
    async (
        credentialId,
        reason
    ) => {

        const response = await api.patch(
            `/admin/credentials/${credentialId}/reject`,
            {
                reason
            },
            getAdminConfig()
        );

        return response.data;
    };