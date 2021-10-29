const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateUser,
  getCurrentUser,
  signOut,
} = require('../controllers/users'); // контроллеры пользователя

const {
  changeInformationValidation,
} = require('../middlewares/validation');

router.get('/users/me', auth, getCurrentUser); // запрос на получение данных данного пользователя
router.patch('/users/me', auth, changeInformationValidation, updateUser);
router.get('/signout', auth, signOut);

module.exports = router;
