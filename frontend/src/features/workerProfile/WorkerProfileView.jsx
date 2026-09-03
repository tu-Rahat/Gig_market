import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  getWorkerProfile
} from "./workerProfileAPI";

const WorkerProfileView = () => {
  const { userId } = useParams();
  const [data, setData] =
    useState(null);
  const [reviews, setReviews] =
    useState([]);
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

        const reviewResponse = await api.get(
          `/reviews/providers/${userId}`
        );
        setReviews(reviewResponse.data.reviews || []);
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
  const provider = data.user || {};
  const badges =
    profile?.badges ||
    provider?.badges ||
    [];

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
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Portfolio
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mt-4">
            {(profile.portfolio || []).map(
              (project, index) => (
                <article
                  key={
                    project._id ||
                    `${project.title}-${index}`
                  }
                  className="border rounded-2xl overflow-hidden"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-52 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {project.description}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
          {(profile.portfolio || []).length ===
            0 && (
            <p className="text-gray-500 mt-3">
              No portfolio items added yet.
            </p>
          )}
        </section>
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Badges
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {(badges || []).map((badge) => (
              <span
                key={badge._id || badge.type || badge.name}
                className="border rounded-full px-3 py-1 text-sm bg-amber-50 text-amber-800"
              >
                {badge.name}
              </span>
            ))}
          </div>
          {(badges || []).length === 0 && (
            <p className="text-gray-500 mt-3">
              No badges earned yet.
            </p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-4 mt-4">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="border rounded-2xl p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {review.customer?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.task?.title || "Completed task"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">
                    {review.rating}/5
                  </span>
                </div>

                {review.comment && (
                  <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                    {review.comment}
                  </p>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>

          {reviews.length === 0 && (
            <p className="text-gray-500 mt-3">
              No reviews yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default WorkerProfileView;