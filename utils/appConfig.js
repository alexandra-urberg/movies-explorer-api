// Слушаем 3000 порт
const {
  DB = 'mongodb://localhost:27017/moviesdb', PORT = 3000, NODE_ENV, JWT_SECRET = '8975SecretCode3q456t',
} = process.env;

// JWT_SECRET = 'secret-key'
module.exports = {
  DB, PORT, JWT_SECRET, NODE_ENV,
};
