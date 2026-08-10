const Task = require(
  "../task/task.model"
);
const Bid = require(
  "../bid/bid.model"
);
const Credential = require(
  "../credential/credential.model"
);

const filterTaskBidders = async (
  req,
  res
) => {
  try {
    const {
      credentialType = "all",
      verificationStatus = "verified"
    } = req.query;

    const task = await Task.findById(
      req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (
      task.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only the task owner can filter bidders"
      });
    }

    const bids = await Bid.find({
      task: task._id,
      status: "active"
    })
      .populate(
        "bidder",
        "name"
      )
      .sort({
        amount: 1,
        createdAt: 1
      });

    const allowedTypes = [
      "all",
      "certificate",
      "license",
      "experience"
    ];
    const allowedStatuses = [
      "all",
      "not_submitted",
      "pending",
      "verified",
      "rejected"
    ];

    if (
      !allowedTypes.includes(
        credentialType
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid credential type filter"
      });
    }

    if (
      !allowedStatuses.includes(
        verificationStatus
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid verification status filter"
      });
    }

    const results = [];

    for (const bid of bids) {
      const credentialQuery = {
        owner: bid.bidder._id
      };

      if (
        credentialType !== "all"
      ) {
        credentialQuery
          .credentialType =
          credentialType;
      }

      if (
        verificationStatus !==
        "all"
      ) {
        credentialQuery
          .verificationStatus =
          verificationStatus;
      }

      const credentials =
        await Credential.find(
          credentialQuery
        )
          .select(
            "credentialType title issuer verificationStatus verifiedAt"
          )
          .sort({
            verifiedAt: -1,
            createdAt: -1
          });

      // When a specific filter is selected,
      // include only bidders who match it.
      const filterIsActive =
        credentialType !== "all" ||
        verificationStatus !== "all";

      if (
        filterIsActive &&
        credentials.length === 0
      ) {
        continue;
      }

      const verifiedCount =
        await Credential.countDocuments({
          owner: bid.bidder._id,
          verificationStatus:
            "verified"
        });

      results.push({
        bid: {
          _id: bid._id,
          amount: bid.amount,
          message: bid.message,
          createdAt:
            bid.createdAt
        },
        bidder: {
          _id:
            bid.bidder._id,
          name:
            bid.bidder.name
        },
        matchingCredentials:
          credentials,
        verifiedCredentialCount:
          verifiedCount
      });
    }

    return res.status(200).json({
      taskId: task._id,
      taskTitle: task.title,
      filters: {
        credentialType,
        verificationStatus
      },
      count: results.length,
      bidders: results
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to filter bidders",
      error: error.message
    });
  }
};

module.exports = {
  filterTaskBidders
};