const { Router } = require('express');
const router = Router();

const coursesRoutes = require('./courses');
const cardRoutes = require('./card');
const orderRoutes = require('./orders');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');

router.get('/', (req, res) => {
  // res.status(200); // default
  res.render(
    'index', 
    { title: 'Главная страница', isHome: true }
  );
})

router.use(authRoutes);
router.use('/courses', coursesRoutes);
router.use('/card', cardRoutes);
router.use('/orders', orderRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
