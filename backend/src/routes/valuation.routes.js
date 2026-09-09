const express = require('express');
const router = express.Router();
const valuationController = require('../controllers/valuation.controller');

router.post('/', valuationController.createValuation);
router.get('/:id/export', valuationController.exportValuationPDF);
router.get('/property/:propertyId', valuationController.getValuations);

module.exports = router;
