import api from "../../services/api";

export const getNearbyProviders = async ({
    latitude,
    longitude,
    maxDistance = 20,
    available = true
}) => {
    const response = await api.get("/providers/nearby", {
        params: {
            latitude,
            longitude,
            maxDistance,
            available
        }
    });
    return response.data;
};
