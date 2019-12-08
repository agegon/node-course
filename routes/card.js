const { Router } = require('express');
const router = Router();

const Card = require('../models/card');
const Course = require('../models/course');

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.redirect('/courses');
})

router.get('/', async (req, res) => {
  const card = await Card.getCard();
  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: card.courses,
    price: card.price,
  })
})

module.exports = router;
