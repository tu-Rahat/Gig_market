import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getWorkerProfile
} from "./workerProfileAPI";

const WorkerProfileView = () => {
  const { userId } = useParams();
  const [data, setData] =
    useState(null);
  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result =
          await getWorkerProfile(
            userId
          );
        setData(result);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load worker profile"
        );
      }
    };
    loadProfile();
  }, [userId]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        Loading worker profile...
      </div>
    );
  }

  const profile = data.profile;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        to="/workers/filter"
        className="text-sm text-gray-600"
      >
        Back to Bidder Filter
      </Link>
      <section className="border rounded-3xl p-7 mt-5">
        <h1 className="text-3xl font-bold">
          {data.user.name}
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          {profile.headline ||
            "Gig Market Worker"}
        </p>
        {profile.bio && (
          <p className="mt-5 text-gray-700 whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}
        <div className="mt-7">
          <h2 className="text-xl font-semibold">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {(profile.skills || []).map(
              (skill) => (
                <span
                  key={skill}
                  className="border rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              )
            )}
          </div>
          {(profile.skills || []).length ===
            0 && (
            <p className="text-gray-500 mt-3">
              No skills added yet.
            </p>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Experience
          </h2>
          <div className="space-y-4 mt-4">
            {(profile.experience || []).map(
              (item) => (
                <article
                  key={item._id}
                  className="border rounded-2xl p-4"
                >
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>
                  {item.organization && (
                    <p className="text-gray-600 mt-1">
                      {item.organization}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-3">
                      {item.description}
                    </p>
                  )}
                </article>
              )
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Completed Jobs ({data.completedJobCount})
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {data.completedJobs.map(
              (job) => (
                <article
                  key={job.taskId}
                  className="border rounded-2xl p-4"
                >
                  <h3 className="font-semibold">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {job.category ||
                      "General"}
                    {" - "}
                    {job.location}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkerProfileView;