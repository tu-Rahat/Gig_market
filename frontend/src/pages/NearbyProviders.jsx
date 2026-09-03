import { useState } from "react";
import { getNearbyProviders } from "../features/provider/providerAPI";

const NearbyProviders = () => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [maxDistance, setMaxDistance] = useState("20");
    const [available, setAvailable] = useState(true);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState("");

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser");
            return;
        }

        setLocationLoading(true);
        setError("");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(String(position.coords.latitude));
                setLongitude(String(position.coords.longitude));
                setLocationLoading(false);
            },
            () => {
                setError("Unable to access your location");
                setLocationLoading(false);
            }
        );
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError("");
            const data = await getNearbyProviders({
                latitude,
                longitude,
                maxDistance,
                available
            });
            setProviders(data.providers || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load nearby providers"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold">Nearby Providers</h1>
            <p className="mt-2 text-gray-600">
                Find available providers by distance from your location.
            </p>

            {error && (
                <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locationLoading}
                className="mt-6 border px-4 py-2 rounded-xl disabled:opacity-50"
            >
                {locationLoading ? "Locating..." : "Use My Current Location"}
            </button>

            <form
                onSubmit={handleSearch}
                className="grid md:grid-cols-4 gap-4 mt-5 border rounded-3xl p-5"
            >
                <input
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    className="border rounded-xl p-3"
                    required
                />
                <input
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    className="border rounded-xl p-3"
                    required
                />
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={maxDistance}
                    onChange={(event) => setMaxDistance(event.target.value)}
                    placeholder="Maximum distance (km)"
                    className="border rounded-xl p-3"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded-xl px-5 py-3 disabled:opacity-50"
                >
                    {loading ? "Searching..." : "Find Providers"}
                </button>
            </form>

            <label className="flex gap-2 items-center mt-5">
                <input
                    type="checkbox"
                    checked={available}
                    onChange={(event) => setAvailable(event.target.checked)}
                />
                Available providers only
            </label>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
                {providers.map((item) => (
                    <article
                        key={item.provider._id}
                        className="border rounded-3xl p-6"
                    >
                        <h2 className="text-xl font-semibold">
                            {item.provider.name}
                        </h2>
                        <p className="mt-2">Distance: {item.distanceKm} km</p>
                        <p className="mt-1">
                            Availability: {item.provider.isAvailable ?
                                "Available" : "Unavailable"}
                        </p>
                        <p className="mt-1">
                            Rating: {item.provider.rating?.average ?? 0}
                        </p>
                        {item.provider.experience && (
                            <p className="mt-1">
                                Experience: {item.provider.experience}
                            </p>
                        )}
                        {item.provider.bio && (
                            <p className="mt-3 text-gray-600">
                                {item.provider.bio}
                            </p>
                        )}
                    </article>
                ))}
            </div>

            {providers.length === 0 && !loading && (
                <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray-500">
                    Search to see providers in your area.
                </div>
            )}
        </main>
    );
};

export default NearbyProviders;
