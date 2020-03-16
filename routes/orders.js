const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const Order = require('../models/order');

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user');
    
    res.render('orders', {
      isOrders: true,
      title: 'Заказы',
      orders: orders.map(o => ({
        ...o._doc,
        price: o.courses.reduce((acc, c) => acc + c.count * c.course.price, 0)
      }))
    });
    
  } catch (err) {
    console.log(err)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.course')
      .execPopulate();

    const courses = user.cart.items.map(item => ({
      count: item.count,
      course: { ...item.course._doc }
    }));

    const order = new Order({
      courses,
      user: req.user,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders')
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
