const router = require('express').Router(); // роутеры
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', addMovie);
router.delete('/movies/movieId', deleteMovie);
