const bcrypt = require('bcryptjs'); // для хеширования пароля
const jwt = require('jsonwebtoken'); // для создания токина
const User = require('../models/users');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFoundError = require('../errors/BadRequest');
const {
  emailConflict,
  unfilledEmailAndPassword,
  unauthorizedUser,
  notFoundedUser,
  invalidFormat,
} = require('../errors/errorsMessages');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports.createUser = (req, res, next) => { // signup
  const {
    name,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new Conflict(emailConflict));
      } bcrypt.hash(password, 10) // хешируем пароль
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((usr) => res.status(201).send({
          _id: usr._id,
          email: usr.email,
        }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequest(unfilledEmailAndPassword));
          } next(error);
        });
    });
};

module.exports.login = (req, res, next) => { // signin
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new Unauthorized(unauthorizedUser));
          } const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }); // создаем токен
          res
            .cookie('jwt', token, { // создаем куки при правильной аутентификации
              httpOnly: true,
              sameSite: true,
              maxAge: 3600000 * 24 * 7,
            })
            .status(201).send({
              message: 'Successful authentication',
            });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(unfilledEmailAndPassword));
      } else {
        next(new Unauthorized(unauthorizedUser));
      } next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => { // получаем информацию о себе
  User.findById(req.user._id)
    .orFail(() => {
      throw next(new NotFoundError(notFoundedUser));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequest(invalidFormat));
      } next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw next(new NotFoundError(notFoundedUser));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(unfilledEmailAndPassword));
      } else {
        next(err);
      }
    });
};
