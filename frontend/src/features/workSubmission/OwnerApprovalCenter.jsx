import { useEffect, useState } from "react";
import {
 getOwnerPendingSubmissions,
 reviewCompletedWork
} from "./workSubmissionAPI";
const OwnerApprovalCenter = () => {
 const [submissions, setSubmissions] =
 useState([]);
 const [rejectionReasons, setRejectionReasons] =
 useState({});
 const [workingId, setWorkingId] =
 useState(null);
 const [error, setError] =
 useState("");
 const [message, setMessage] =
 useState("");
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