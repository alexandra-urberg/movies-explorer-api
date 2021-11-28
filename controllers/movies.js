const Movie = require('../models/movies');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');
const {
  incorrectData,
  notFoundedMovie,
  forbiddenToDelete,
  sucsessfulDelete,
} = require('../errors/errorsMessages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  return Movie.findOne({ movieId, owner: req.user._id })
    .then((movie) => {
      if (movie) {
        throw new Conflict(notFoundedMovie);
      }

      return Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user._id,
      });
    })
    .then((movie) => {
      const { _id } = movie;
      return Movie.findById({ _id }).populate('owner');
    })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(incorrectData));
      } next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      throw next(new NotFound(notFoundedMovie));
    })
    .then((movie) => {
      if (String(movie.owner) === owner) {
        return Movie.findByIdAndRemove(movieId);
      } throw next(new BadRequest(forbiddenToDelete));
    })
    .then(() => res.send(sucsessfulDelete))
    .catch((err) => {
      if (err === 'CastError') {
        next(new BadRequest(incorrectData));
      } next(err);
    });
};
