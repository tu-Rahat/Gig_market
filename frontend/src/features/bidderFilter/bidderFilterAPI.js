import api from "../../services/api";

const getAuthConfig = () => {
  return {};
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