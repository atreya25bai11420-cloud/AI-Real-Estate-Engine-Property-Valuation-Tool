const propertyService = require('../services/property.service');
const { createPropertySchema } = require('../validators/property.validator');

const getProperties = async (req, res) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProperty = async (req, res) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const validatedData = createPropertySchema.parse(req.body);
    const newProperty = await propertyService.createProperty(validatedData);
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

module.exports = { getProperties, getProperty, createProperty };
