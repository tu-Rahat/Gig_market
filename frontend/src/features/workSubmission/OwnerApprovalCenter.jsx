import { useEffect, useState } from "react";
import { createReview } from "../review/reviewAPI";
import {
 getOwnerPendingSubmissions,
 reviewCompletedWork
} from "./workSubmissionAPI";
const OwnerApprovalCenter = () => {
 const [submissions, setSubmissions] =
 useState([]);
 const [rejectionReasons, setRejectionReasons] =
 useState({});
 const [reviewDrafts, setReviewDrafts] =
 useState({});
 const [workingId, setWorkingId] =
 useState(null);
 const [reviewingId, setReviewingId] =
 useState(null);
 const [error, setError] =
 useState("");
 const [message, setMessage] =
 useState("");
 const [reviewMessages, setReviewMessages] =
 useState({});
 const loadSubmissions = async () => {
 try {
 const data =
 await getOwnerPendingSubmissions();
 setSubmissions(
 data.submissions || []
 );
 } catch (err) {
 setError(
 err.response?.data?.message ||
 "Failed to load submitted work"
 );
 }
 };
 useEffect(() => {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       loadSubmissions();
 }, []);
 const handleApprove = async (
 submissionId
 ) => {
 try {
 setWorkingId(submissionId);
 setError("");
 setMessage("");
 const data =
 await reviewCompletedWork({
 submissionId,
 decision: "approve",
 rejectionReason: ""
 });
 setMessage(data.message);
 await loadSubmissions();
 } catch (err) {
 setError(
 err.response?.data?.message ||
 "Failed to approve completed work"
 );
 } finally {
 setWorkingId(null);
 }
 };
 const handleReject = async ( 
            submissionId
 ) => {
 const rejectionReason =
 rejectionReasons[submissionId] || "";
 if (!rejectionReason.trim()) {
 setError(
 "Enter a rejection reason before rejecting work"
 );
 return;
 }
 try {
 setWorkingId(submissionId);
 setError("");
 setMessage("");
 const data =
 await reviewCompletedWork({
 submissionId,
 decision: "reject",
 rejectionReason
 });
 setMessage(data.message);
 setRejectionReasons({
 ...rejectionReasons,
 [submissionId]: ""
 });
 await loadSubmissions();
 } catch (err) {
 setError(
 err.response?.data?.message ||
 "Failed to reject completed work"
 );
 } finally {
 setWorkingId(null);
 }
 };
 const handleReviewSubmit = async (
 submission
 ) => {
 const taskId = submission.task?._id;
 if (!taskId) {
 setError("Task information is missing for this review.");
 return;
 }
 const rating =
 reviewDrafts[submission._id]?.rating ?? 5;
 const comment =
 reviewDrafts[submission._id]?.comment || "";
 try {
 setReviewingId(submission._id);
 setError("");
 const data = await createReview(
 taskId,
 rating,
 comment
 );
 setReviewMessages({
 ...reviewMessages,
 [submission._id]: data.message
 });
 setReviewDrafts({
 ...reviewDrafts,
 [submission._id]: {
 rating: 5,
 comment: ""
 }
 });
 } catch (err) {
 setReviewMessages({
 ...reviewMessages,
 [submission._id]:
 err.response?.data?.message ||
 "Failed to submit review"
 });
 } finally {
 setReviewingId(null);
 }
 };
 return (
 <div className="max-w-6xl mx-auto px-6 py-12">
 <div>
 <h1 className="text-3xl font-bold">
 Review Completed Work
 </h1>
 <p className="mt-2 text-gray-600">
 Approve satisfactory work or reject it with a reason.
 </p>
 </div>
 {error && (
 <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
 {error}
 </div>
 )}
 {message && (
 <div className="mt-5 p-3 rounded-xl bg-green-50 text-green-700">
 {message}
 </div>
 )}
 <div className="space-y-5 mt-8">
 {submissions.map((submission) => (
 <article
 key={submission._id}
 className="border rounded-3xl p-6"
 >
 <div className="grid lg:grid-cols-[1fr_320px] gap-6">
 <div>
 <h2 className="text-xl font-semibold">
 {submission.task?.title ||
 "Task"}
 </h2>
 <p className="text-gray-600 mt-2">
        Worker:{" "}
 {submission.worker?.name}
 </p>
 <p className="text-sm text-gray-500 mt-2">
 Submitted:{" "}
 {new Date(
 submission.submittedAt
 ).toLocaleString()}
 </p>
 <div className="mt-5">
 <h3 className="font-medium">
 Completion Note
 </h3>
 <p className="mt-2 text-gray-700 whitespace-pre-wrap">
 {submission.completionNote}
 </p>
 </div>
 {submission.evidence?.originalName && (
 <div className="mt-5 p-4 bg-gray-50 rounded-xl">
 <span className="text-sm text-gray-500">
 Evidence uploaded
 </span>
 <p className="font-medium mt-1">
 {submission.evidence.originalName}
 </p>
 </div>
 )}
 <div className="mt-5 text-sm text-gray-600">
 Escrow:{" "}
 {submission.escrow?.amount}{" "}
 {submission.escrow?.currency}
 {" - "}
 {submission.escrow?.status}
 </div>
 </div>
 <div className="border rounded-2xl p-5 h-fit">
 <button
 type="button"
 onClick={() =>
 handleApprove(
 submission._id
 )
 }
 disabled={
 workingId ===
 submission._id
 }
 className="w-full bg-black text-white py-3 rounded-xl
disabled:opacity-60"
 >
 Approve Work
 </button>
 <div className="my-5 border-t" />
 <label className="block text-sm font-medium mb-2">
 Rejection Reason
 </label>
 <textarea
 value={
 rejectionReasons[
 submission._id
 ] || ""
 }
 onChange={(event) =>
 setRejectionReasons({
 ...rejectionReasons,
 [submission._id]:
 event.target.value
 })
 }
 rows="4"
 placeholder="Explain what needs to be corrected..."
 className="w-full border rounded-xl p-3"
 />
 <button
 type="button"
 onClick={() =>
 handleReject(
 submission._id
 )
 }
 disabled={
 workingId ===
 submission._id
 }
 className="w-full border border-black mt-3 py-3 rounded-xl
disabled:opacity-60"
 >
 Reject Work
 </button>

 <div className="mt-6 border-t pt-4">
 <h3 className="text-lg font-semibold">
 Rate this Provider
 </h3>
 <select
 value={
 reviewDrafts[
 submission._id
 ]?.rating ?? 5
 }
 onChange={(event) =>
 setReviewDrafts({
 ...reviewDrafts,
 [submission._id]: {
 rating: Number(
 event.target.value
 ),
 comment:
 reviewDrafts[
 submission._id
 ]?.comment || ""
 }
 })
 }
 className="border rounded-xl p-3 mt-3 w-full"
 >
 <option value={5}>5 — Excellent</option>
 <option value={4}>4 — Very Good</option>
 <option value={3}>3 — Good</option>
 <option value={2}>2 — Poor</option>
 <option value={1}>1 — Very Poor</option>
 </select>
 <textarea
 value={
 reviewDrafts[
 submission._id
 ]?.comment || ""
 }
 onChange={(event) =>
 setReviewDrafts({
 ...reviewDrafts,
 [submission._id]: {
 rating:
 reviewDrafts[
 submission._id
 ]?.rating ?? 5,
 comment:
 event.target.value
 }
 })
 }
 placeholder="Write your review..."
 rows="4"
 className="w-full border rounded-xl p-3 mt-4"
 />
 <button
 type="button"
 onClick={() =>
 handleReviewSubmit(
 submission
 )
 }
 disabled={
 reviewingId ===
 submission._id
 }
 className="bg-black text-white px-5 py-3 rounded-xl mt-4 w-full disabled:opacity-60"
 >
 Submit Review
 </button>
 {reviewMessages[
 submission._id
 ] && (
 <p className="mt-3 text-sm text-gray-700">
 {reviewMessages[
 submission._id
 ]}
 </p>
 )}
 </div>
 </div>
 </div>
 </article>
 ))}
 </div>
 {submissions.length === 0 && (
 <div className="mt-8 border border-dashed rounded-2xl p-10 text-center textgray-500">
 No completed work is waiting for your review.
 </div>
 )}
 </div>
 );
};
export default OwnerApprovalCenter;