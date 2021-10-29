require('dotenv').config(); // для секретного ключа
const express = require('express');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { PORT, DB } = require('./utils/appConfig');
const rateLimiter = require('./utils/rateLimiter');
const router = require('./routes/index');
const ErrorsHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(helmet());

app.use(requestLogger);

app.use(rateLimiter);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // I have the latest version of mangoose
  // where (useCreateIndex: true) and (useFindAndModify: false) are default manuals
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(ErrorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
