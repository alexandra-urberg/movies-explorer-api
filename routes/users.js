const router = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users'); // контроллеры пользователя

router.get('/users/me', getCurrentUser); // запрос на получение данных данного пользователя
router.patch('/users/me', updateUser);

module.export = router;
