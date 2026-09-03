import api from "../../services/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createReview = async (taskId, rating, comment) => {
  const response = await api.post(
    `/reviews/tasks/${taskId}`,
    {
      rating,
      comment
    },
    getAuthConfig()
  );

  return response.data;
};

export const getMyReviewableTasks = async () => {

    const response = await api.get(
        "/reviews/mine/reviewable",
        getAuthConfig()
    );

    return response.data;

};