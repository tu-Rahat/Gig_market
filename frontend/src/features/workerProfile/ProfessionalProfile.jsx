import { useEffect, useState, useCallback } from "react";
import {
  getMyProfessionalProfile,
  saveMyProfessionalProfile
} from "./workerProfileAPI";

const emptyExperience = {
  title: "",
  organization: "",
  description: "",
  startDate: "",
  endDate: ""
};

const ProfessionalProfile = () => {
  const [formData, setFormData] =
    useState({
      headline: "",
      bio: "",
      skillsText: "",
      experience: []
    });
  const [completedJobs, setCompletedJobs] =
    useState([]);
  const [
    verifiedCredentials,
    setVerifiedCredentials
  ] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");

  const loadProfile = useCallback(async () => {
    try {
      const data =
        await getMyProfessionalProfile();
      setFormData({
        headline:
          data.profile?.headline ||
          "",
        bio:
          data.profile?.bio ||
          "",
        skillsText:
          (
            data.profile?.skills ||
            []
          ).join(", "),
        experience:
          data.profile?.experience ||
          []
      });
      setCompletedJobs(
        data.completedJobs || []
      );
      setVerifiedCredentials(
        data.verifiedCredentials ||
        []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load professional profile"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calling the async loader here triggers state updates —
    // disable the specific lint rule for this call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          ...emptyExperience
        }
      ]
    });
  };

  const updateExperience = (
    index,
    field,
    value
  ) => {
    const nextExperience =
      [...formData.experience];
    nextExperience[index] = {
      ...nextExperience[index],
      [field]: value
    };
    setFormData({
      ...formData,
      experience:
        nextExperience
    });
  };

  const removeExperience = (
    index
  ) => {
    setFormData({
      ...formData,
      experience:
        formData.experience.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    });
  };

  const handleSave = async (
    event
  ) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const skills =
      formData.skillsText
        .split(",")
        .map((skill) =>
          skill.trim()
        )
        .filter(Boolean);
    try {
      setSaving(true);
      const data =
        await saveMyProfessionalProfile({
          headline:
            formData.headline,
          bio:
            formData.bio,
          skills,
          experience:
            formData.experience
        });
      setMessage(data.message);
      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save professional profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold">
          Professional Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Build your worker profile with skills and experience.
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
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
        <form
          onSubmit={handleSave}
          className="border rounded-3xl p-6"
        >
          <label className="block text-sm font-medium mb-2">
            Professional Headline
          </label>
          <input
            value={formData.headline}
            onChange={(event) =>
              setFormData({
                ...formData,
                headline:
                  event.target.value
              })
            }
            placeholder="Example: Experienced delivery and home-service worker"
            className="w-full border rounded-xl p-3"
          />
          <label className="block text-sm font-medium mt-5 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(event) =>
              setFormData({
                ...formData,
                bio:
                  event.target.value
              })
            }
            rows="5"
            placeholder="Tell clients about your work background..."
            className="w-full border rounded-xl p-3"
          />
          <label className="block text-sm font-medium mt-5 mb-2">
            Skills
          </label>
          <input
            value={formData.skillsText}
            onChange={(event) =>
              setFormData({
                ...formData,
                skillsText:
                  event.target.value
              })
            }
            placeholder="Cleaning, Delivery, Tutoring"
            className="w-full border rounded-xl p-3"
          />
          <p className="text-xs text-gray-500 mt-2">
            Separate skills with commas.
          </p>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-semibold">
              Experience
            </h2>
            <button
              type="button"
              onClick={addExperience}
              className="border px-4 py-2 rounded-xl"
            >
              Add Experience
            </button>
          </div>
          <div className="space-y-5 mt-5">
            {formData.experience.map(
              (item, index) => (
                <div
                  key={
                    item._id ||
                    index
                  }
                  className="border rounded-2xl p-4"
                >
                  <input
                    value={
                      item.title ||
                      ""
                    }
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Role / experience title"
                    className="w-full border rounded-xl p-3"
                    required
                  />
                  <input
                    value={
                      item.organization ||
                      ""
                    }
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "organization",
                        event.target.value
                      )
                    }
                    placeholder="Organization / client"
                    className="w-full border rounded-xl p-3 mt-3"
                  />
                  <textarea
                    value={
                      item.description ||
                      ""
                    }
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    rows="3"
                    placeholder="What did you do?"
                    className="w-full border rounded-xl p-3 mt-3"
                  />
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <input
                      type="date"
                      value={
                        item.startDate
                          ? String(
                              item.startDate
                            ).slice(0, 10)
                          : ""
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "startDate",
                          event.target.value
                        )
                      }
                      className="w-full border rounded-xl p-3"
                    />
                    <input
                      type="date"
                      value={
                        item.endDate
                          ? String(
                              item.endDate
                            ).slice(0, 10)
                          : ""
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "endDate",
                          event.target.value
                        )
                      }
                      className="w-full border rounded-xl p-3"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeExperience(
                        index
                      )
                    }
                    className="text-sm border px-3 py-2 rounded-xl mt-3"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-3 rounded-xl mt-7 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Professional Profile"}
          </button>
        </form>
        <aside className="space-y-6">
          <section className="border rounded-3xl p-6">
            <h2 className="text-xl font-semibold">
              Completed Jobs
            </h2>
            <p className="text-3xl font-bold mt-3">
              {completedJobs.length}
            </p>
            <div className="space-y-3 mt-5">
              {completedJobs.map(
                (job) => (
                  <div
                    key={job.taskId}
                    className="border rounded-xl p-3"
                  >
                    <p className="font-medium">
                      {job.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.category ||
                        "General"}
                      {" - "}
                      {job.location}
                    </p>
                  </div>
                )
              )}
            </div>
            {completedJobs.length ===
              0 && (
              <p className="text-sm text-gray-500 mt-4">
                No completed jobs yet.
              </p>
            )}
          </section>
          <section className="border rounded-3xl p-6">
            <h2 className="text-xl font-semibold">
              Verified Credentials
            </h2>
            <div className="space-y-3 mt-5">
              {verifiedCredentials.map(
                (credential) => (
                  <div
                    key={credential._id}
                    className="border rounded-xl p-3"
                  >
                    <p className="font-medium">
                      {credential.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {credential.credentialType}
                      {credential.issuer
                        ? ` - ${credential.issuer}`
                        : ""}
                    </p>
                  </div>
                )
              )}
            </div>
            {verifiedCredentials.length ===
              0 && (
              <p className="text-sm text-gray-500 mt-4">
                No verified credentials yet.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProfessionalProfile;