// Слушаем 3000 порт
const { DB = 'mongodb://localhost:27017/moviesdb', PORT = 3000, JWT_SECRET = 'secret-key' } = process.env;

module.exports = { DB, PORT, JWT_SECRET };
