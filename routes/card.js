const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

const createCartData = async (reqUser) => {
  const user = await reqUser
    .populate('cart.items.course')
    .execPopulate();

  const courses = user.cart.items.map(item => ({ ...item.course._doc, count: item.count }));
  const price = courses.reduce((acc, item) => acc + item.count * item.price, 0);

  return { courses, price };
}

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
})

router.delete('/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const data = await createCartData(req.user);

  res.status(200).json(data);
})

router.get('/', async (req, res) => {
  const data = await createCartData(req.user);

  res.render('card', {
    ...data,
    title: 'Корзина',
    isCard: true,
  })
})

module.exports = router;
