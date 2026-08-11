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
  const user = await User.findById(
    userId
  ).select(
    "name"
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

  const allCredentials =
    await Credential.find({
      owner: userId
    })
      .select(
        "credentialType title issuer issuedDate verificationStatus verifiedAt rejectionReason verificationRequestedAt"
      )
      .sort({
        createdAt: -1
      });
  return {
    user: {
      _id: user._id,
      name: user.name
    },
    profile: profile || {
      owner: user._id,
      headline: "",
      bio: "",
      skills: [],
      experience: []
    },
    completedJobs,
    completedJobCount:
      completedJobs.length,
    verifiedCredentials,
    allCredentials
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
      experience = []
    } = req.body;

    if (!Array.isArray(experience)) {
      return res.status(400).json({
        message:
          "Experience must be an array"
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
            cleanedExperience
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

module.exports = {
  getMyProfile,
  getPublicProfile,
  saveMyProfile
};