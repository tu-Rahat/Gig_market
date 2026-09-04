import api from "../../services/api";
const getAuthConfig = () => {
 return {};
};
export const getWorkerAssignments = async () => {
 const response = await api.get(
 "/work-submissions/worker/assignments",
 getAuthConfig()
 );
 return response.data;
};
export const getOwnerPendingSubmissions = async () => {
 const response = await api.get(
 "/work-submissions/owner/pending",
 getAuthConfig()
 );
 return response.data;
};
export const getSubmissionHistory = async (
 escrowId
) => {
 const response = await api.get(
 `/work-submissions/escrow/${escrowId}/history`,
 getAuthConfig()
 );
 return response.data;
};
export const submitCompletedWork = async ({
 escrowId,
 completionNote,
 evidence
}) => {
 const formData = new FormData();
 formData.append(
 "completionNote",
 completionNote
 );
 if (evidence) {
 formData.append(
 "evidence",
 evidence
 );
 }
 const response = await api.post(
 `/work-submissions/escrow/${escrowId}/submit`,
 formData,
 getAuthConfig()
 );
 return response.data;
};
export const reviewCompletedWork = async ({
 submissionId,
 decision,
 rejectionReason
}) => {
 const response = await api.patch(
 `/work-submissions/${submissionId}/review`,
 {
 decision,
 rejectionReason
 },
 getAuthConfig()
 );
 return response.data;
};
