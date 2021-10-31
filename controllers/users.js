const bcrypt = require('bcryptjs'); // для хеширования пароля
const jwt = require('jsonwebtoken'); // для создания токина
const User = require('../models/users');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFoundError = require('../errors/BadRequest');
const {
  unfilledEmailPasswordAndName,
  emailConflict,
  unfilledEmailAndPassword,
  unauthorizedUser,
  notFoundedUser,
  blankEmailField,
} = require('../errors/errorsMessages');
const { JWT_SECRET } = require('../utils/appConfig');

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
            next(new BadRequest(unfilledEmailPasswordAndName));
          } next(error);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => { // signin
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new Unauthorized(unauthorizedUser));
            return;
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
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest(unfilledEmailAndPassword));
          } else {
            next(new Unauthorized(unauthorizedUser));
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(unfilledEmailAndPassword));
      } else {
        next(new Unauthorized(notFoundedUser));
      } next(err);
    });
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').send('Cookie deleted');
};

module.exports.getCurrentUser = (req, res, next) => { // получаем информацию о себе
  User.findById(req.user._id)
    .orFail(() => {
      throw next(new NotFoundError(notFoundedUser));
    })
    .then((user) => {
      if (!user) {
        next(new Unauthorized(unauthorizedUser));
        return;
      }res.send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 11000) {
        next(new Conflict(emailConflict));
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
    .then((user) => {
      if (!user) {
        next(new Unauthorized(unauthorizedUser));
        return;
      } res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(emailConflict));
      } if (err.name === 'ValidationError') {
        next(new BadRequest(unfilledEmailAndPassword));
      } else if (err.name === 'CastError') {
        next(new BadRequest(blankEmailField));
      } else {
        next(err);
      }
    });
};
