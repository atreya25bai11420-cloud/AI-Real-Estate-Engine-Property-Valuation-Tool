const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

/**
 * @openapi
 * /api/analytics/property/{propertyId}:
 *   get:
 *     summary: Retrieve property appreciation analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property analytics report
 */
router.get('/property/:propertyId', analyticsController.getPropertyAnalytics);

module.exports = router;
