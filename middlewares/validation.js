const { celebrate, Joi } = require('celebrate'); // валидация
const validator = require('validator');

const isUrl = (value) => {
  const result = validator.isURL(value);

  if (result) {
    return value;
  } throw new Error('URL validation error');
};

module.exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.changeInformationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.importMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrl),
    trailer: Joi.string().required().custom(isUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(isUrl),
    movieId: Joi.number().required(),
  }),
});

module.exports.removeMovieValidation = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});
