const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { unauthorizedUser } = require('../errors/errorsMessages');

const { JWT_SECRET = 'secret-key' } = process.env; // secret key

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) { // check cookies
    return next(new Unauthorized(unauthorizedUser));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized(unauthorizedUser));
  }

  req.user = payload;

  return next();
};