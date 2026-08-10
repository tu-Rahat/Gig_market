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

export const getMyCredentials = async () => {
  const response = await api.get(
    "/credentials/mine",
    getAuthConfig()
  );
  return response.data;
};

export const uploadCredential = async ({
  credentialType,
  title,
  issuer,
  description,
  issuedDate,
  document
}) => {
  const formData = new FormData();
  formData.append(
    "credentialType",
    credentialType
  );
  formData.append(
    "title",
    title
  );
  formData.append(
    "issuer",
    issuer
  );
  formData.append(
    "description",
    description
  );
  if (issuedDate) {
    formData.append(
      "issuedDate",
      issuedDate
    );
  }
  formData.append(
    "document",
    document
  );
  const response = await api.post(
    "/credentials/upload",
    formData,
    getAuthConfig()
  );
  return response.data;
};

export const requestVerification = async (
  credentialId
) => {
  const response = await api.patch(
    `/credentials/${credentialId}/request-verification`,
    {},
    getAuthConfig()
  );
  return response.data;
};

export const deleteCredential = async (
  credentialId
) => {
  const response = await api.delete(
    `/credentials/${credentialId}`,
    getAuthConfig()
  );
  return response.data;
};