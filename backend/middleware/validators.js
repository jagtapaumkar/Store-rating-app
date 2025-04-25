const { body } = require('express-validator');

const nameValidation = body('name')
  .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters');

const emailValidation = body('email')
  .isEmail().withMessage('Invalid email format');

const addressValidation = body('address')
  .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters');

const passwordValidation = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
  .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must include at least one special character');

const ratingValidation = body('rating')
  .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5');

module.exports = {
  nameValidation,
  emailValidation,
  addressValidation,
  passwordValidation,
  ratingValidation
};
