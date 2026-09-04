import api from "../../services/api";

const getAuthConfig = () => {
  return {};
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