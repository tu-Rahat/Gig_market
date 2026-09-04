import api from "../../services/api";


const getAdminConfig = () => {
    return {};
};


// ============================================
// Get pending disputes
// ============================================

export const getPendingDisputes =
    async () => {

        const response =
            await api.get(
                "/disputes/admin/pending",
                getAdminConfig()
            );

        return response.data;

    };


// ============================================
// Resolve dispute
// ============================================

export const resolveDispute =
    async (
        disputeId,
        decision,
        adminNote
    ) => {

        const response =
            await api.patch(
                `/disputes/admin/${disputeId}/resolve`,
                {
                    decision,
                    adminNote
                },
                getAdminConfig()
            );

        return response.data;

    };
