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
  const user = await req.user
    .populate('cart.items.course')
    .execPopulate();

  const courses = user.cart.items.map(item => ({ ...item.course._doc, count: item.count }));
  const price = courses.reduce((acc, item) => acc + item.count * item.price, 0);
  
  res.render('card', {
    price,
    courses,
    title: 'Корзина',
    isCard: true,
  })
})

module.exports = router;
