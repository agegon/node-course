const { body } = require('express-validator/check');
const User = require('../models/user');

exports.registerValidators = [
  body('email').isEmail().withMessage('Введите корректный email').custom(async (value, { req }) => {
    try {
      const candidate = await User.findOne({ email: value });
      if (candidate) {
        return Promise.reject('Такой email уже зарегистрирован в системе');
      }
    } catch (err) {
      console.log(err);
    }
  }),
  body('password', 'Введите корректный пароль (не менее 6 символов)').isLength({ min: 6, max: 32 }).isAlphanumeric(),
  body('passwordConfirm').custom((value, { req }) => {
    if (req.body.password !== value) {
      throw new Error('Пароли должны совпадать');
    }

    return true;
  }),
  body('name', 'Введите корректное имя').isLength({ min: 3, max: 32 }),
];
