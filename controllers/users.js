const bcrypt = require('bcryptjs'); // для хеширования пароля
const jwt = require('jsonwebtoken'); // для создания токина
const User = require('../models/users');

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
        // next(new Conflict('Подльзователь с такой почтой уже существует!'));
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
            // next(new BadRequest('Поле email и password должны быть обязательно заполненны'));
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
            // next(new Unauthorized('Передан неккоректный пароль'));
          } const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }); // создаем токен
          res
            .cookie('jwt', token, { // создаем куки при правильной аутентификации
              httpOnly: true,
              sameSite: true,
              maxAge: 3600000 * 24 * 7,
            })
            .status(201).send({
              message: 'Аутентификация прошла успешно',
            });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // next(new BadRequest('Поле email или password не должны быть пустыми'));
      } else {
        // next(new Unauthorized('Передан неккоректный email'));
      } next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => { // получаем информацию о себе
  User.findById(req.user._id)
    .orFail(() => {
      // throw next(new NotFoundError('Пользователь по заданному id отсутствует'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        // next(new BadRequest('Неверный формат id'));
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
      // throw next(new NotFoundError('Пользователь по заданному id отсутствует'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // next(new BadRequest('Оба поля должны быть заполненны!'));
      } else {
        next(err);
      }
    });
};
