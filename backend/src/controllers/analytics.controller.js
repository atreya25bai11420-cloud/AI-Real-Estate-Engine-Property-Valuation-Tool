const analyticsService = require('../services/analytics.service');

const getPropertyAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getPropertyAnalytics(req.params.propertyId);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPropertyAnalytics };
