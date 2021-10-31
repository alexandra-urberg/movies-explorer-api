const router = require('express').Router();
const {
  updateUser,
  getCurrentUser,
  signOut,
} = require('../controllers/users'); // контроллеры пользователя

const {
  changeInformationValidation,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser); // запрос на получение данных данного пользователя
router.patch('/me', changeInformationValidation, updateUser);
router.get('/signout', signOut);

module.exports = router;
