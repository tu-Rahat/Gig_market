import { useEffect, useState } from "react";

const emptyForm = {
  credentialType: "certificate",
  title: "",
  issuer: "",
  description: "",
  issuedDate: "",
  document: null
};

const formatIssuedDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const CredentialEditModal = ({
  credential,
  saving = false,
  error = "",
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!credential) {
      return;
    }

    setFormData({
      credentialType: credential.credentialType || "certificate",
      title: credential.title || "",
      issuer: credential.issuer || "",
      description: credential.description || "",
      issuedDate: formatIssuedDate(credential.issuedDate),
      document: null
    });
  }, [credential]);

  if (!credential) {
    return null;
  }

  const handleChange = (event) => {
    if (event.target.name === "document") {
      setFormData({
        ...formData,
        document:
          event.target.files?.[0] || null
      });
      return;
    }

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Edit Credential</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update the details for {credential.title}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-sm"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Credential Type</label>
            <select
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 bg-white"
            >
              <option value="certificate">Certificate</option>
              <option value="license">License</option>
              <option value="experience">Experience Document</option>
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
            className="w-full border rounded-xl p-3"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Issued Date</label>
            <input
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Replace Document</label>
            <input
              type="file"
              name="document"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleChange}
              className="w-full border rounded-xl p-3 bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              Leave this empty to keep the current file. You can upload a new PDF, JPG, PNG, DOC, or DOCX.
            </p>
            {credential.document?.originalName && (
              <p className="text-xs text-gray-500 mt-2">
                Current file: {credential.document.originalName}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-5 py-3 rounded-xl disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialEditModal;
