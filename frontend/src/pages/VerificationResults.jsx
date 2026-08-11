import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getMyCredentials,
  requestVerification,
  updateCredential
} from "../features/credential/credentialAPI";
import CredentialEditModal from "../features/credential/CredentialEditModal";

const statusLabel = {
  not_submitted: "Not Submitted",
  pending: "Pending Review",
  verified: "Verified",
  rejected: "Rejected"
};

const VerificationResults = () => {
  const [searchParams] = useSearchParams();
  const credentialId = searchParams.get("credentialId");
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingCredential, setEditingCredential] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        setLoading(true);
        const data = await getMyCredentials();
        setCredentials(data.credentials || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load verification results"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCredentials();
  }, []);

  const selectedCredential = credentialId
    ? credentials.find((item) => item._id === credentialId)
    : null;

  const credentialsToShow = selectedCredential
    ? [selectedCredential]
    : credentials;

  const handleEditClick = (credential) => {
    if (credential.verificationStatus === "pending") {
      setError("Pending credentials cannot be edited");
      return;
    }

    setError("");
    setEditError("");
    setEditingCredential(credential);
  };

  const handleSaveEdit = async (formData) => {
    if (!editingCredential) {
      return;
    }

    try {
      setEditSaving(true);
      setEditError("");

      const data = await updateCredential(
        editingCredential._id,
        formData
      );

      setEditingCredential(null);
      setError("");
      await getMyCredentials().then((data) => {
        setCredentials(data.credentials || []);
      });

      if (data.message) {
        setError("");
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          "Failed to update credential"
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleRequestVerification = async (credentialId) => {
    try {
      setWorkingId(credentialId);
      setError("");
      setMessage("");

      const data = await requestVerification(credentialId);

      setMessage(data.message);

      const refreshed = await getMyCredentials();
      setCredentials(refreshed.credentials || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to request verification"
      );
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Verification Result</h1>
        <p className="mt-2 text-gray-600">
          Check the current verification status of your submitted credentials.
        </p>
      </div>

      {loading && (
        <div className="border rounded-2xl p-6">Loading verification results...</div>
      )}

      {!loading && error && (
        <div className="border rounded-2xl p-6 bg-red-50 text-red-700">{error}</div>
      )}

      {!loading && message && (
        <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700">
          {message}
        </div>
      )}

      {!loading && !error && credentialsToShow.length === 0 && (
        <div className="border border-dashed rounded-2xl p-8 text-center text-gray-500">
          No credentials found.
        </div>
      )}

      {!loading && !error && credentialsToShow.length > 0 && (
        <div className="space-y-4">
          {credentialsToShow.map((credential) => (
            <article key={credential._id} className="border rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <h2 className="text-xl font-semibold">{credential.title}</h2>
                    <span className="text-xs border rounded-full px-3 py-1">
                      {credential.credentialType}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    Status: {statusLabel[credential.verificationStatus] || credential.verificationStatus}
                  </p>
                  {credential.issuer && (
                    <p className="mt-1 text-gray-600">Issuer: {credential.issuer}</p>
                  )}
                  {credential.verificationRequestedAt && (
                    <p className="mt-1 text-sm text-gray-500">
                      Requested at: {new Date(credential.verificationRequestedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <span className="border rounded-full px-3 py-1 text-sm h-fit w-fit">
                  {credential.verificationStatus}
                </span>
              </div>

              {credential.description && (
                <p className="mt-4 text-gray-700">{credential.description}</p>
              )}

              {credential.verificationStatus === "rejected" && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700">
                  <p className="font-medium">Verification Rejected</p>
                  <p className="mt-1 text-sm">
                    {credential.rejectionReason || "No rejection reason was provided."}
                  </p>
                </div>
              )}

              {credential.verificationStatus === "verified" && (
                <div className="mt-4 p-4 rounded-xl bg-green-50 text-green-700">
                  Your credential is verified and approved.
                </div>
              )}

              {credential.verificationStatus === "pending" && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-50 text-yellow-700">
                  Your verification request is currently under review.
                </div>
              )}

              <div className="mt-5">
                <div className="flex flex-wrap gap-3">
                  {(credential.verificationStatus === "not_submitted" ||
                    credential.verificationStatus === "rejected") && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRequestVerification(credential._id)
                      }
                      disabled={workingId === credential._id}
                      className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-60"
                    >
                      Request Verification
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditClick(credential)}
                    disabled={credential.verificationStatus === "pending"}
                    title={
                      credential.verificationStatus === "pending"
                        ? "Pending credentials cannot be edited"
                        : "Edit this credential"
                    }
                    className="border px-4 py-2 rounded-xl disabled:opacity-60"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingCredential && (
        <CredentialEditModal
          credential={editingCredential}
          saving={editSaving}
          error={editError}
          onClose={() => setEditingCredential(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default VerificationResults;
