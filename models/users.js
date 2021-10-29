const mongoose = require('mongoose');
const { isEmail } = require('validator');
const {
  invalidFormat,
  blankNameField,
  minLengtName,
  maxLengtName,
  blankEmailField,
  blankPasswordField,
  minLengtPassword,
} = require('../errors/errorsMessages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, blankNameField],
    minlength: [2, minLengtName],
    maxlength: [30, maxLengtName],
  },
  email: {
    type: String,
    unique: true,
    required: [true, blankEmailField],
    validate: {
      validator: (v) => isEmail(v),
      message: invalidFormat,
    },
  },
  password: {
    type: String,
    required: [true, blankPasswordField],
    minlength: [8, minLengtPassword],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
