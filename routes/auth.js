const { Router } = require('express');
const bcrypt = require('bcryptjs');
const mailgun = require('mailgun-js');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator/check');

const User = require('../models/user');
const keys = require('../keys');
const createRegMail = require('../emails/registration');
const createResetMail = require('../emails/resetEmail');

const mailgunMessages = mailgun({
  apiKey: keys.MAILGUN_API_KEY,
  domain: keys.MAILGUN_DOMAIN,
}).messages();

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
  })
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    const canLogin = !!candidate && await bcrypt.compare(password, candidate.password);
    if (canLogin) {
      req.session.isAuthenticated = true;
      req.session.user = candidate;

      req.session.save(err => {
        if (err) throw err;
        res.redirect('/');
      });
    } else {
      req.flash('loginError', 'Такого пользователя не существует');
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.post('/register', body('email').isEmail(), async (req, res) => {
  try {
    const { email, name, password, passwordConfirm } = req.body;
    const candidate = await User.findOne({ email });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      res.status(422).redirect('/login#register');
      return;
    }

    if (candidate) {
      req.flash('registerError', 'Пользователь с таким email уже зарегистрирован');
      res.redirect('/login#register');
    } else if (password !== passwordConfirm) {
      res.redirect('/login#register');
    } else {
      const hash = await bcrypt.hash(password, 10);
      const user = new User({
        email, 
        name, 
        password: hash,
      });
      await user.save();
      res.redirect('/login#login');
      await mailgunMessages.send(createRegMail(email));
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль?',
    error: req.flash('error'),
  });
})

router.post('/reset', async (req, res) => {
  try {
    const token = await new Promise((resolve, reject) => 
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString('hex'));
      })
    );

    const candidate = await User.findOne({ email: req.body.email });

    if (candidate) {
      candidate.resetToken = token;
      candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
      await candidate.save();
      await mailgunMessages.send(createResetMail(candidate.email, token));
      res.redirect('/login');
    } else {
      const err = new Error();
      err.text = 'Пользователь не найден'
      throw err;
    }
  } catch (err) {
    const message = (err && err.text) || 'Что-то пошло не так, повторите попытку позже';
    req.flash('error', message);
    res.redirect('/reset');
    console.log(err);
  }
})

router.get('/recover/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findOne({ 
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/login');
    }

    res.render('auth/recover', {
      title: 'Восстановление пароля',
      error: req.flash('error'),
      userId: user._id.toString(),
      token: req.params.token,
    });    

  } catch (err) {
    console.log(err);
  }
})

router.post('/recover', async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/login');
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.redirect('/login');

  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
