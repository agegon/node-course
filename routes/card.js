const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const Course = require('../models/course');

const createCartData = async (reqUser) => {
  const user = await reqUser
    .populate('cart.items.course')
    .execPopulate();

  const courses = user.cart.items.map(item => ({ 
    ...item.course._doc, 
    id: item.course._id, 
    count: item.count 
  }));
  const price = courses.reduce((acc, item) => acc + item.count * item.price, 0);

  return { courses, price };
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
})

router.delete('/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const data = await createCartData(req.user);

  res.status(200).json(data);
})

router.get('/', auth, async (req, res) => {
  const data = await createCartData(req.user);

  res.render('card', {
    ...data,
    title: 'Корзина',
    isCard: true,
  })
})

module.exports = router;
