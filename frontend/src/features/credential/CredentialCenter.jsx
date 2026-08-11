import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCredentials,
  updateCredential,
  uploadCredential
} from "./credentialAPI";
import CredentialEditModal from "./CredentialEditModal";

const initialForm = {
  credentialType: "certificate",
  title: "",
  issuer: "",
  description: "",
  issuedDate: ""
};

const CredentialCenter = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] =
    useState([]);
  const [formData, setFormData] =
    useState(initialForm);
  const [documentFile, setDocumentFile] =
    useState(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [editingCredential, setEditingCredential] =
    useState(null);
  const [editError, setEditError] =
    useState("");
  const [editSaving, setEditSaving] =
    useState(false);

  const loadCredentials = async () => {
    try {
      const data =
        await getMyCredentials();
      setCredentials(
        data.credentials || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load credentials"
      );
    }
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      await loadCredentials();
    };

    fetchCredentials();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value
    });
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!documentFile) {
      setError(
        "Please select a credential document"
      );
      return;
    }
    try {
      setLoading(true);
      const data =
        await uploadCredential({
          ...formData,
          document:
            documentFile
        });
      setMessage(data.message);
      setFormData(initialForm);
      setDocumentFile(null);
      event.target.reset();
      await loadCredentials();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to upload credential"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeeResult = async (
    credentialId
  ) => {
    navigate(
      `/verification?credentialId=${credentialId}`
    );
  };

  const handleEditClick = (credential) => {
    if (credential.verificationStatus === "pending") {
      setError(
        "Pending credentials cannot be edited"
      );
      return;
    }

    setError("");
    setMessage("");
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

      setMessage(data.message);
      setEditingCredential(null);
      await loadCredentials();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          "Failed to update credential"
      );
    } finally {
      setEditSaving(false);
    }
  };

  return (
  <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="grid lg:grid-cols-[400px_1fr] gap-8">
      <section className="border rounded-3xl p-6 h-fit">
        <h1 className="text-2xl font-bold">
          Upload Credential
        </h1>
        <p className="mt-2 text-gray-600">
          Add a certificate, license, or experience document.
        </p>
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700">
            {message}
          </div>
        )}
        <form
          onSubmit={handleUpload}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Credential Type
            </label>
            <select
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 bg-white"
            >
              <option value="certificate">
                Certificate
              </option>
              <option value="license">
                License
              </option>
              <option value="experience">
                Experience Document
              </option>
            </select>
          </div>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Credential title"
            className="w-full border rounded-xl p-3"
            required
          />
          <input
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="Issuer / organization"
            className="w-full border rounded-xl p-3"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Short description"
          />
          <div>
            <label className="block text-sm font-medium mb-2">
              Issued Date (optional)
            </label>
            <input
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Document
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(event) =>
                setDocumentFile(
                  event.target.files[0] ||
                  null
                )
              }
              className="w-full border rounded-xl p-3"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              PDF, JPG, PNG, DOC, or DOCX. Maximum 5 MB.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
          >
            {loading
              ? "Uploading..."
              : "Upload Credential"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          My Credentials
        </h2>
        <p className="mt-2 text-gray-600">
          Upload documents and view verification results.
        </p>
        <div className="space-y-4 mt-6">
          {credentials.map((credential) => (
            <article
              key={credential._id}
              className="border rounded-2xl p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap4">
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="text-lg font-semibold">
                      {credential.title}
                    </h3>
                    <span className="text-xs border rounded-full px-3 py1">
                      {credential.credentialType}
                    </span>
                  </div>
                  {credential.issuer && (
                    <p className="text-gray-600 mt-2">
                      Issuer: {credential.issuer}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    File: {credential.document?.originalName}
                  </p>
                </div>
                <span className="border rounded-full px-3 py-1 text-sm h-fit
                w-fit">
                  {credential.verificationStatus}
                </span>
              </div>
              {credential.description && (
                <p className="mt-4 text-gray-700">
                  {credential.description}
                </p>
              )}
              {credential.verificationStatus === "rejected" && (
    <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700">

        <p className="font-medium">
            Verification Rejected
        </p>

        <p className="mt-1 text-sm">
            {credential.rejectionReason ||
                "No rejection reason was provided."}
        </p>

        <p className="mt-2 text-xs">
            Correct the issue if necessary, then request verification again.
        </p>

    </div>
)}
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  type="button"
                  onClick={() =>
                    handleSeeResult(
                      credential._id
                    )
                  }
                  className="bg-black text-white px-4 py-2 rounded-xl"
                >
                  See Result
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleEditClick(credential)
                  }
                  disabled={
                    credential.verificationStatus ===
                    "pending"
                  }
                  title={
                    credential.verificationStatus ===
                    "pending"
                      ? "Pending credentials cannot be edited"
                      : "Edit this credential"
                  }
                  className="border px-4 py-2 rounded-xl disabled:opacity-60"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
        {credentials.length === 0 && (
          <div className="mt-6 border border-dashed rounded-2xl p-8 text-center
          text-gray-500">
            No credentials uploaded yet.
          </div>
        )}
      </section>
    </div>

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
export default CredentialCenter;

