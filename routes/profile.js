const { Router } = require('express');
const fs = require('fs/promises');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = Router();

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Профиль',
    isProfile: true,
    user: req.user.toObject(),
  })
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const oldAvatarSrc = user.avatarUrl;

    const toChange = {
      name: req.body.name,
    }

    if (req.file) {
      toChange.avatarUrl = '/' + req.file.path.replace('\\', '/');
    }

    Object.assign(user, toChange);
    await user.save();

    if (req.file) {
      await fs.unlink(path.join(process.cwd(), oldAvatarSrc)).catch((err) => console.log(err));
    }
    
    res.redirect('/profile');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
