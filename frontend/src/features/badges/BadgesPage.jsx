import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfessionalProfile } from "../workerProfile/workerProfileAPI";

const BADGE_META = {
  verified_provider: {
    icon: "✓",
    name: "Verified Provider",
    description:
      "Your credentials have been verified and checked by the platform.",
    requirement: "Complete at least 1 verified credential.",
    accent: "emerald"
  },
  top_rated: {
    icon: "★",
    name: "Top Rated",
    description:
      "Clients consistently rate your work highly and trust your service.",
    requirement: "Reach a 4.5+ average rating with at least 5 reviews.",
    accent: "amber"
  },
  expert_professional: {
    icon: "✦",
    name: "Expert Professional",
    description:
      "A proven expert with a strong record of consistent, high-quality work.",
    requirement:
      "Complete 20 jobs, maintain a 4.5+ rating, and have at least 10 reviews.",
    accent: "violet"
  }
};

const formatAwardDate = (dateValue) => {
  if (!dateValue) {
    return "Awarded recently";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Awarded recently";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const getAccentClasses = (accent) => {
  const palettes = {
    emerald: {
      badge: "bg-emerald-100 text-emerald-700",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500"
    },
    amber: {
      badge: "bg-amber-100 text-amber-700",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-500"
    },
    violet: {
      badge: "bg-violet-100 text-violet-700",
      pill: "bg-violet-50 text-violet-700 border-violet-200",
      bar: "bg-violet-500"
    }
  };

  return palettes[accent] || palettes.emerald;
};

const BadgesPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const data = await getMyProfessionalProfile();
        setProfileData(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load badge information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, []);

  const badgeData = useMemo(() => {
    if (!profileData) {
      return [];
    }

    const user = profileData.user || {};
    const earnedBadges = Array.isArray(user.badges) ? user.badges : [];
    const earnedMap = new Map(
      earnedBadges
        .filter((badge) => badge && badge.type)
        .map((badge) => [badge.type, badge])
    );

    const verifiedCount = Array.isArray(profileData.verifiedCredentials)
      ? profileData.verifiedCredentials.length
      : 0;
    const averageRating = Number(user.rating?.average ?? 0);
    const reviewCount = Number(user.rating?.count ?? 0);
    const completedJobs = Number(user.completedJobs ?? 0);

    return Object.entries(BADGE_META).map(([type, meta]) => {
      const earnedBadge = earnedMap.get(type);
      const isEarned = Boolean(earnedBadge);

      let progressValue = 0;
      let progressTarget = 1;
      let progressLabel = "";
      let progressPercent = 0;
      let state = isEarned ? "earned" : "locked";

      if (type === "verified_provider") {
        progressValue = verifiedCount;
        progressTarget = 1;
        progressLabel = `${verifiedCount} / 1 verified credential`;
        progressPercent = Math.min((verifiedCount / 1) * 100, 100);
        if (!isEarned && verifiedCount > 0) {
          state = "progress";
        }
      }

      if (type === "top_rated") {
        progressValue = reviewCount;
        progressTarget = 5;
        progressLabel = `${reviewCount} / 5 reviews`;
        progressPercent = Math.min((reviewCount / 5) * 100, 100);
        if (!isEarned && (averageRating > 0 || reviewCount > 0)) {
          state = "progress";
        }
      }

      if (type === "expert_professional") {
        const jobProgress = Math.min((completedJobs / 20) * 100, 100);
        const ratingProgress = Math.min((averageRating / 4.5) * 100, 100);
        const reviewProgress = Math.min((reviewCount / 10) * 100, 100);
        progressValue = completedJobs;
        progressTarget = 20;
        progressLabel = `${completedJobs} / 20 completed jobs`;
        progressPercent = Math.max(jobProgress, ratingProgress, reviewProgress);
        if (!isEarned && (completedJobs > 0 || averageRating > 0 || reviewCount > 0)) {
          state = "progress";
        }
      }

      return {
        type,
        ...meta,
        state,
        badge: earnedBadge,
        progressLabel,
        progressValue,
        progressTarget,
        progressPercent
      };
    });
  }, [profileData]);

  const earnedCount = badgeData.filter((badge) => badge.state === "earned").length;
  const lockedCount = badgeData.filter((badge) => badge.state !== "earned").length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 text-gray-600">
          Loading badges and achievements...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
            Recognition
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Badges &amp; Achievements
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Earn recognition and build trust with clients.
          </p>
        </div>

        <Link
          to="/profile/professional"
          className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
        >
          Back to Professional Profile
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Earned badges</p>
          <p className="mt-3 text-4xl font-bold text-gray-900">{earnedCount}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Locked / available</p>
          <p className="mt-3 text-4xl font-bold text-gray-900">{lockedCount}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {badgeData.map((badge) => {
          const metaClasses = getAccentClasses(badge.accent);
          const statusLabel =
            badge.state === "earned"
              ? "Earned"
              : badge.state === "progress"
                ? "In progress"
                : "Locked";

          return (
            <article
              key={badge.type}
              className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${metaClasses.badge}`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{badge.name}</h2>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${metaClasses.pill}`}
                >
                  {statusLabel}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">{badge.description}</p>

              {badge.state === "earned" && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Earned
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Awarded {formatAwardDate(badge.badge?.awardedAt)}
                  </p>
                </div>
              )}

              {badge.state === "progress" && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                    <span>Progress</span>
                    <span>{Math.round(badge.progressPercent)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${metaClasses.bar}`}
                      style={{ width: `${Math.min(Math.max(badge.progressPercent, 8), 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-700">{badge.progressLabel}</p>
                </div>
              )}

              {badge.state === "locked" && (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                    Requirement
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{badge.requirement}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {badgeData.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
          No badges are available yet.
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
