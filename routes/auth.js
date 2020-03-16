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
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate && password === candidate.password) {
      req.session.isAuthenticated = true;
      req.session.user = candidate;

      req.session.save(err => {
        if (err) throw err;
        res.redirect('/');
      });
    } else {
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
      res.redirect('/login#register');
    } else if (password !== passwordConfirm) {
      res.redirect('/login#register');
    } else {
      const user = new User({
        email, 
        name, 
        password,
      });
      await user.save();
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
