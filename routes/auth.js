const { Router } = require('express');
const bcrypt = require('bcryptjs');
const mailgun = require('mailgun-js');

const User = require('../models/user');
const keys = require('../keys');
const createRegMail = require('../emails/registation');

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

router.post('/register', async (req, res) => {
  try {
    const { email, name, password, passwordConfirm } = req.body;
    const candidate = await User.findOne({ email });

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

module.exports = router;
