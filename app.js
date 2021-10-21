const express = require('express');
const { PORT } = require('./utils/appConfig');
const rateLimiter = require('./utils/rateLimiter');

const app = express();
app.use(rateLimiter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
