const { body } = require('express-validator');

const User = require('../models/user');

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Введите корректный email')
    .custom(async (value) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject('Такой email уже зарегистрирован в системе');
        }
      } catch (err) {
        console.log(err);
      }
    }).normalizeEmail(),
  body('password', 'Введите корректный пароль (не менее 6 символов)')
    .isLength({ min: 6, max: 32 })
    .isAlphanumeric(),
  body('passwordConfirm')
    .custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error('Пароли должны совпадать');
      }

      return true;
    }),
  body('name', 'Введите корректное имя')
    .isLength({ min: 3, max: 32 })
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Введите email')
    .normalizeEmail(),
  body('password', 'Введите пароль')
    .isLength({ min: 1 }),
];

exports.courseValidators = [
  body('title')
    .isLength({ min: 3, max: 150 }).withMessage('Длинна заголовка должна быть от 3 до 150 символов')
    .trim(),
  body('price')
    .isNumeric().withMessage('Цена должна быть числом')
    .toInt(),
  body('img')
    .isURL().withMessage('Введите корректный URL изображения'),
];
