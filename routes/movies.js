const router = require('express').Router(); // роутеры
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  importMovieValidation,
  removeMovieValidation,
} = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', addMovie, importMovieValidation);
router.delete('/movies/movieId', deleteMovie, removeMovieValidation);
