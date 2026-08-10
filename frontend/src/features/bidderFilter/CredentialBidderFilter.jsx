import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyTasks
} from "../task/taskAPI";
import {
  filterTaskBidders
} from "./bidderFilterAPI";

const CredentialBidderFilter = () => {
  const [tasks, setTasks] =
    useState([]);
  const [taskId, setTaskId] =
    useState("");
  const [
    credentialType,
    setCredentialType
  ] = useState("all");
  const [
    verificationStatus,
    setVerificationStatus
  ] = useState("verified");
  const [results, setResults] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data =
          await getMyTasks();
        setTasks(
          (data.tasks || []).filter(
            (task) =>
              task.status === "open"
          )
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load your tasks"
        );
      }
    };
    loadTasks();
  }, []);

  const handleFilter = async (
    event
  ) => {
    event.preventDefault();
    if (!taskId) {
      setError(
        "Select one of your open tasks"
      );
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data =
        await filterTaskBidders({
          taskId,
          credentialType,
          verificationStatus
        });
      setResults(
        data.bidders || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to filter bidders"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="max-w-6xl mx-auto px-6 py-12">
    <div>
      <h1 className="text-3xl font-bold">
        Credential-Based Bidder Filter
      </h1>
      <p className="mt-2 text-gray-600">
        Filter bidders on your task by credential type
        and verification status.
      </p>
    </div>
    {error && (
      <div className="mt-5 p-3 rounded-xl bg-red-50 text-red-700">
        {error}
      </div>
    )}
    <form
      onSubmit={handleFilter}
      className="grid md:grid-cols-4 gap-4 mt-8 border rounded-3xl p-5"
    >
      <select
        value={taskId}
        onChange={(event) =>
          setTaskId(
            event.target.value
          )
        }
        className="border rounded-xl p-3 bg-white"
        required
      >
        <option value="">
          Select your task
        </option>
        {tasks.map((task) => (
          <option
            key={task._id}
            value={task._id}
          >
            {task.title}
          </option>
        ))}
      </select>
      <select
        value={credentialType}
        onChange={(event) =>
          setCredentialType(
            event.target.value
          )
        }
        className="border rounded-xl p-3 bg-white"
      >
        <option value="all">
          All Credential Types
        </option>
        <option value="certificate">
          Certificate
        </option>
        <option value="license">
          License
        </option>
        <option value="experience">
          Experience
        </option>
      </select>
      <select
        value={verificationStatus}
        onChange={(event) =>
          setVerificationStatus(
            event.target.value
          )
        }
        className="border rounded-xl p-3 bg-white"
      >
        <option value="all">
          Any Status
        </option>
        <option value="verified">
          Verified
        </option>
        <option value="pending">
          Pending
        </option>
        <option value="not_submitted">
          Not Submitted
        </option>
        <option value="rejected">
          Rejected
        </option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-xl px-5 py-3 disabled:opacity-60"
      >
        {loading
          ? "Filtering..."
          : "Apply Filter"}
      </button>
    </form>
    <div className="grid lg:grid-cols-2 gap-5 mt-8">
      {results.map((item) => (
        <article
          key={item.bid._id}
          className="border rounded-3xl p-6"
        >
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {item.bidder.name}
              </h2>
              <p className="text-gray-600 mt-2">
                Bid:{" "}
                <span className="font-semibold text-black">
                  {item.bid.amount} BDT
                </span>
              </p>
            </div>
            <span className="border rounded-full px-3 py-1 text-sm h-fit">
              {item.verifiedCredentialCount} verified
            </span>
          </div>
          {item.bid.message && (
            <p className="text-sm text-gray-600 mt-4">
              {item.bid.message}
            </p>
          )}
          <div className="mt-5">
            <h3 className="font-medium">
              Matching Credentials
            </h3>
            <div className="space-y-2 mt-3">
              {item.matchingCredentials.map(
                (credential) => (
                  <div
                    key={credential._id}
                    className="border rounded-xl p-3 text-sm"
                  >
                    <p className="font-medium">
                      {credential.title}
                    </p>
                    <p className="text-gray-500 mt-1">
                      {credential.credentialType}
                      {" - "}
                      {credential.verificationStatus}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          <Link
            to={`/workers/${item.bidder._id}/profile`}
            className="inline-block mt-5 bg-black text-white px-4 py-2 rounded-xl"
          >
            View Worker Profile
          </Link>
        </article>
      ))}
    </div>
    {results.length === 0 && !loading && (
      <div className="mt-8 border border-dashed rounded-2xl p-10 text-center text-gray500">
        No bidders match the selected filter yet.
      </div>
    )}
  </div>
);
};

export default CredentialBidderFilter;