const { Router } = require('express');
const router = Router();

const User = require('../models/user');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  })
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findById('5e676785260eda31ac1b40a7');
    req.session.isAuthenticated = true;
    req.session.user = user;

    req.session.save(err => {
      if (err) throw err;
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
