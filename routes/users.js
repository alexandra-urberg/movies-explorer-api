const router = require('express').Router();
const {
  updateUser,
  getCurrentUser,
  signOut,
} = require('../controllers/users'); // контроллеры пользователя

const {
  changeInformationValidation,
} = require('../middlewares/validation');

router.get('/users/me', getCurrentUser); // запрос на получение данных данного пользователя
router.patch('/users/me', updateUser, changeInformationValidation);
router.get('/signout', signOut);

module.exports = router;
