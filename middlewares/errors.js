const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode;
  const response = err.message;

  res.status(status).send({ response });

  next();
};

module.exports = errorsHandler;