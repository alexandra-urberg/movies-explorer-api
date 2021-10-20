const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Add your name',
    required: [true, 'Your username cannot be blank.'],
    minlength: [2, 'Username must be at least 2 characters.'],
    maxlength: [30, 'Username must be less than 30 characters.'],
  },
  email: {
    type: String,
    default: 'Add your e-mail',
    unique: true,
    required: [true, 'Your e-mail cannot be blank.'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    default: 'Add your password',
    minlength: [8, 'Password must be at least 8 characters.'],
    required: [true, 'Your password cannot be blank.'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
