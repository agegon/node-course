const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
})

router.delete('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);
  const card = await Card.remove(course);
  const courses = await Promise.all(card.courses.map(async crs => {
    const course = await Course.getById(crs.id);
    if (course) {
      course.count = crs.count;
      return course;
    }
  }));
  res.json({ ...card, courses });
})

router.get('/', async (req, res) => {
  const card = await Card.getCard();
  const courses = await Promise.all(card.courses.map(async crs => {
    const course = await Course.getById(crs.id);
    if (course) {
      course.count = crs.count;
      return course;
    }
  }));
  
  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: courses,
    price: card.price,
  })
})

module.exports = router;
