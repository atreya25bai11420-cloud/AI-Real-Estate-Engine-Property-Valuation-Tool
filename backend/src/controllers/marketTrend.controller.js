const marketTrendService = require('../services/marketTrend.service');
const { createMarketTrendSchema } = require('../validators/marketTrend.validator');

const getTrend = async (req, res) => {
  try {
    const trend = await marketTrendService.getTrendByZip(req.params.zipCode);
    if (!trend) return res.status(404).json({ error: 'No market trend data found for this ZIP code' });
    res.json(trend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTrend = async (req, res) => {
  try {
    const validatedData = createMarketTrendSchema.parse(req.body);
    const newTrend = await marketTrendService.createTrend(validatedData);
    res.status(201).json(newTrend);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

module.exports = { getTrend, createTrend };
