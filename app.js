const express = require('express');
const rateLimiter = require('./utils/rateLimiter');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(rateLimiter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
