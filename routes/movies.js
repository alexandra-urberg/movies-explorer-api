const router = require('express').Router(); // роутеры
const auth = require('../middlewares/auth');
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  importMovieValidation,
  removeMovieValidation,
} = require('../middlewares/validation');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, importMovieValidation, addMovie);
router.delete('/movies/:movieId', auth, removeMovieValidation, deleteMovie);

module.exports = router;
