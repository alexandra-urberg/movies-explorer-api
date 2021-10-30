const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { signInValidation, signUpValidation } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const { defaultError } = require('../errors/errorsMessages');

router.post('/signup', signUpValidation, createUser);
router.post('/signin', signInValidation, login);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(defaultError));
});

module.exports = router;
