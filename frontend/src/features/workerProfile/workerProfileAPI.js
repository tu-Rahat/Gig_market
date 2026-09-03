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

export const getMyProfessionalProfile =
  async () => {
    const response = await api.get(
      "/worker-profiles/mine",
      getAuthConfig()
    );
    return response.data;
  };

export const saveMyProfessionalProfile =
  async (profileData) => {
    const response = await api.put(
      "/worker-profiles/mine",
      profileData,
      getAuthConfig()
    );
    return response.data;
  };

export const getWorkerProfile =
  async (userId) => {
    const response = await api.get(
      `/worker-profiles/${userId}`
    );
    return response.data;
  };
export const getProviderPortfolio =
  async (userId) => {
    const response =
      await api.get(
        `/worker-profiles/${userId}/portfolio`
      );
    return response.data;
  };