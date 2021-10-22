const router = require('express').Router();
const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users'); // контроллеры пользователя

const {
  changeInformationValidation,
} = require('../middlewares/validation');

router.get('/users/me', getCurrentUser); // запрос на получение данных данного пользователя
router.patch('/users/me', updateUser, changeInformationValidation);

module.export = router;
