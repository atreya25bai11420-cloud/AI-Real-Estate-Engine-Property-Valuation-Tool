const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);
router.post('/', propertyController.createProperty);

module.exports = router;
