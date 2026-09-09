const express = require('express');
const router = express.Router();
const marketTrendController = require('../controllers/marketTrend.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

/**
 * @openapi
 * /api/market-trends/{zipCode}:
 *   get:
 *     summary: Retrieve market metrics by ZIP
 *     tags: [Market Trends]
 *     parameters:
 *       - in: path
 *         name: zipCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ZIP market metrics
 */
router.get('/:zipCode', marketTrendController.getTrend);

/**
 * @openapi
 * /api/market-trends:
 *   post:
 *     summary: Seed/Update market trends (AGENT or ADMIN only)
 *     tags: [Market Trends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [zipCode, city, avgPricePerSqFt]
 *             properties:
 *               zipCode:
 *                 type: string
 *               city:
 *                 type: string
 *               avgPricePerSqFt:
 *                 type: number
 *               medianSalePrice:
 *                 type: number
 *               inventoryCount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Trend recorded
 */
router.post('/', authenticate, authorize('AGENT', 'ADMIN'), marketTrendController.createTrend);

module.exports = router;
