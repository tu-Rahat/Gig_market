const User = require("../auth/auth.model");
const Credential = require("../credential/credential.model");

const updateProviderBadges = async (providerId) => {
  const provider = await User.findById(providerId);

  if (!provider) {
    return null;
  }

  const verifiedCredentialCount = await Credential.countDocuments({
    owner: providerId,
    verificationStatus: "verified"
  });

  const average = provider.rating?.average || 0;
  const reviewCount = provider.rating?.count || 0;
  const completedJobs = provider.completedJobs || 0;

  const badges = [];

  if (verifiedCredentialCount > 0) {
    badges.push({
      type: "verified_provider",
      name: "Verified Provider",
      awardedAt: new Date()
    });
  }

  if (average >= 4.5 && reviewCount >= 5) {
    badges.push({
      type: "top_rated",
      name: "Top Rated",
      awardedAt: new Date()
    });
  }

  if (completedJobs >= 20 && average >= 4.5 && reviewCount >= 10) {
    badges.push({
      type: "expert_professional",
      name: "Expert Professional",
      awardedAt: new Date()
    });
  }

  provider.badges = badges;
  await provider.save();

  return provider.badges;
};

module.exports = {
  updateProviderBadges
};
