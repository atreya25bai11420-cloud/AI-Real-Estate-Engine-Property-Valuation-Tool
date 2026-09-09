const userService = require('../services/user.service');
const { createUserSchema } = require('../validators/user.validator');

const createUser = async (req, res, next) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const newUser = await userService.createUser(validatedData);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers };
