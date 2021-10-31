// Слушаем 3000 порт
const {
  DB = 'mongodb://localhost:27017/moviesdb', JWT_SECRET = 'secret-key', PORT = 3000,
} = process.env;

// JWT_SECRET = 'secret-key'
module.exports = {
  DB, PORT, JWT_SECRET,
};
