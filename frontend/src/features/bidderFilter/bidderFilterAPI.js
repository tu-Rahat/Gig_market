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

export const filterTaskBidders = async ({
  taskId,
  credentialType,
  verificationStatus
}) => {
  const response = await api.get(
    `/bidder-filter/task/${taskId}`,
    {
      ...getAuthConfig(),
      params: {
        credentialType,
        verificationStatus
      }
    }
  );
  return response.data;
};