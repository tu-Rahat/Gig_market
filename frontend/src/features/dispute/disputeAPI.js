import api from "../../services/api";


const getAuthConfig = () => {
    return {};
};


// =====================================================
// Get escrows belonging to logged-in user
// =====================================================

export const getMyEscrowsForDispute =
    async () => {

        const response =
            await api.get(
                "/escrow/mine",
                getAuthConfig()
            );

        return response.data;

    };


// =====================================================
// Create dispute
// =====================================================

export const createDispute =
    async ({
        escrowId,
        reason,
        description,
        evidence = []
    }) => {

        const formData =
            new FormData();

        formData.append(
            "escrowId",
            escrowId
        );

        formData.append(
            "reason",
            reason
        );

        formData.append(
            "description",
            description
        );


        evidence.forEach(
            (file) => {

                formData.append(
                    "evidence",
                    file
                );

            }
        );


        const response =
            await api.post(
                "/disputes/",
                formData,
                {
                    headers: {
                        ...getAuthConfig()
                            .headers,

                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );


        return response.data;

    };


// =====================================================
// Get my disputes
// =====================================================

export const getMyDisputes =
    async () => {

        const response =
            await api.get(
                "/disputes/mine",
                getAuthConfig()
            );

        return response.data;

    };


// =====================================================
// Get one dispute
// =====================================================

export const getDisputeById =
    async (
        disputeId
    ) => {

        const response =
            await api.get(
                `/disputes/${disputeId}`,
                getAuthConfig()
            );

        return response.data;

    };