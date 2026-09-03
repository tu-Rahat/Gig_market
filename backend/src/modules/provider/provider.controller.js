const User = require("../auth/auth.model");

const calculateDistanceKm = (
    latitudeOne,
    longitudeOne,
    latitudeTwo,
    longitudeTwo
) => {
    const earthRadiusKm = 6371;
    const latitudeDelta =
        (latitudeTwo - latitudeOne) * Math.PI / 180;
    const longitudeDelta =
        (longitudeTwo - longitudeOne) * Math.PI / 180;
    const a =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(latitudeOne * Math.PI / 180) *
        Math.cos(latitudeTwo * Math.PI / 180) *
        Math.sin(longitudeDelta / 2) ** 2;
    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
    return earthRadiusKm * c;
};

const getNearbyProviders = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            maxDistance = 20,
            available = "true"
        } = req.query;
        const latitudeNumber = Number(latitude);
        const longitudeNumber = Number(longitude);
        const distanceLimit = Number(maxDistance);

        if (
            !Number.isFinite(latitudeNumber) ||
            latitudeNumber < -90 ||
            latitudeNumber > 90 ||
            !Number.isFinite(longitudeNumber) ||
            longitudeNumber < -180 ||
            longitudeNumber > 180 ||
            !Number.isFinite(distanceLimit) ||
            distanceLimit < 0
        ) {
            return res.status(400).json({
                message: "Valid location and distance are required"
            });
        }

        const providers = await User.find({
            location: {
                $exists: true,
                $ne: null
            }
        }).select(
            "name profileImage bio skills experience rating completedJobs location isAvailable"
        );

        const results = providers
            .filter((provider) => {
                return available !== "true" || provider.isAvailable === true;
            })
            .map((provider) => {
                const providerLatitude = provider.location?.latitude;
                const providerLongitude = provider.location?.longitude;

                if (
                    !Number.isFinite(providerLatitude) ||
                    !Number.isFinite(providerLongitude)
                ) {
                    return null;
                }

                const distance = calculateDistanceKm(
                    latitudeNumber,
                    longitudeNumber,
                    providerLatitude,
                    providerLongitude
                );

                return {
                    provider,
                    distanceKm: Number(distance.toFixed(2))
                };
            })
            .filter(Boolean)
            .filter((item) => item.distanceKm <= distanceLimit)
            .sort((first, second) => first.distanceKm - second.distanceKm);

        return res.status(200).json({
            count: results.length,
            providers: results
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to find nearby providers",
            error: error.message
        });
    }
};

module.exports = {
    getNearbyProviders
};
