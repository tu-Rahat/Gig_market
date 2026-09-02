const WorkerProfile = require(
  "./workerProfile.model"
);
const User = require(
  "../auth/auth.model"
);
const Escrow = require(
  "../escrow/escrow.model"
);
const Credential = require(
  "../credential/credential.model"
);
const {
  updateProviderBadges
} = require("../badge/badge.service");

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }
  const uniqueSkills = new Set(
    skills
      .map((skill) =>
        String(skill).trim()
      )
      .filter(Boolean)
  );
  return Array.from(uniqueSkills).slice(
    0,
    30
  );
};

const getCompletedJobs = async (
  userId
) => {
  const escrows = await Escrow.find({
    worker: userId
  })
    .populate({
      path: "task",
      match: {
        status: "completed"
      },
      select:
        "title location category status updatedAt",
      populate: {
        path: "category",
        select: "name"
      }
    })
    .sort({
      updatedAt: -1
    });
  return escrows
    .filter((escrow) => escrow.task)
    .map((escrow) => ({
      taskId: escrow.task._id,
      title: escrow.task.title,
      location:
        escrow.task.location,
      category:
        escrow.task.category?.name ||
        "",
      completedAt:
        escrow.task.updatedAt
    }));
};

const buildProfileResponse = async (
  userId
) => {
  await updateProviderBadges(userId);

  const user = await User.findById(
    userId
  ).select(
    "name profileImage bio skills experience certifications rating completedJobs badges"
  );
  if (!user) {
    return null;
  }
  const profile = await WorkerProfile.findOne({
    owner: userId
  });
  const completedJobs =
    await getCompletedJobs(userId);
  const verifiedCredentials =
    await Credential.find({
      owner: userId,
      verificationStatus: "verified"
    })
      .select(
        "credentialType title issuer issuedDate"
      )
      .sort({
        verifiedAt: -1
      });
  return {
    user: {
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage || "",
      bio: user.bio || "",
      skills: user.skills || [],
      experience: user.experience || "",
      certifications: user.certifications || [],
      badges: user.badges || [],
      rating: user.rating || {
        average: 0,
        count: 0
      },
      completedJobs: user.completedJobs || 0
    },
    profile: profile || {
      owner: user._id,
      headline: "",
      bio: "",
      skills: [],
      experience: [],
      portfolio: []
    },
    completedJobs,
    completedJobCount:
      completedJobs.length,
    verifiedCredentials
  };
};
const getMyProfile = async (
  req,
  res
) => {
  try {
    const data =
      await buildProfileResponse(
        req.user.id
      );
    return res.status(200).json(
      data
    );
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to load professional profile",
      error: error.message
    });
  }
};

const getPublicProfile = async (
  req,
  res
) => {
  try {
    const data =
      await buildProfileResponse(
        req.params.userId
      );
    if (!data) {
      return res.status(404).json({
        message:
          "Worker profile not found"
      });
    }
    return res.status(200).json(
      data
    );
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to load worker profile",
      error: error.message
    });
  }
};

const saveMyProfile = async (
  req,
  res
) => {
  try {
    const {
      headline = "",
      bio = "",
      skills = [],
      experience = [],
      portfolio = []
    } = req.body;

    if (!Array.isArray(experience)) {
      return res.status(400).json({
        message:
          "Experience must be an array"
      });
    }

    if (!Array.isArray(portfolio)) {
      return res.status(400).json({
        message:
          "Portfolio must be an array"
      });
    }

    const cleanedExperience =
      experience
        .filter((item) =>
          item &&
          String(
            item.title || ""
          ).trim()
        )
        .slice(0, 20)
        .map((item) => ({
          title:
            String(
              item.title
            ).trim(),
          organization:
            String(
              item.organization ||
              ""
            ).trim(),
          description:
            String(
              item.description ||
              ""
            ).trim(),
          startDate:
            item.startDate ||
            null,
          endDate:
            item.endDate ||
            null
        }));

    const cleanedPortfolio =
      portfolio
        .filter(
          (item) =>
            item &&
            (
              String(
                item.title || ""
              ).trim() ||
              String(
                item.description || ""
              ).trim() ||
              String(
                item.imageUrl || ""
              ).trim()
            )
        )
        .slice(0, 20)
        .map((item) => ({
          title:
            String(
              item.title || ""
            ).trim(),
          description:
            String(
              item.description || ""
            ).trim(),
          imageUrl:
            String(
              item.imageUrl || ""
            ).trim(),
          completedAt:
            item.completedAt || null
        }));

    const profile =
      await WorkerProfile.findOneAndUpdate(
        {
          owner: req.user.id
        },
        {
          owner: req.user.id,
          headline:
            headline.trim(),
          bio:
            bio.trim(),
          skills:
            normalizeSkills(skills),
          experience:
            cleanedExperience,
          portfolio:
            cleanedPortfolio
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

    return res.status(200).json({
      message:
        "Professional profile saved successfully",
      profile
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to save professional profile",
      error: error.message
    });
  }
};

const getProviderPortfolio = async (
  req,
  res
) => {
  try {
    const provider =
      await User.findById(
        req.params.userId
      ).select(
        "name profileImage bio skills experience certifications rating completedJobs badges portfolio"
      );
    if (!provider) {
      return res.status(404).json({
        message:
          "Provider not found"
      });
    }
    const verifiedCredentials =
      await Credential.find({
        owner: provider._id,
        verificationStatus:
          "verified"
      })
        .select(
          "credentialType title issuer verifiedAt"
        )
        .sort({
          verifiedAt: -1
        });
    return res.status(200).json({
      provider,
      verifiedCredentials
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to load provider portfolio",
      error: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  getPublicProfile,
  saveMyProfile,
  getProviderPortfolio
};