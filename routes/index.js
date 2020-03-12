const { Router } = require('express');
const router = Router();

const coursesRoutes = require('./courses');
const cardRoutes = require('./card');
const orderRoutes = require('./orders');

router.get('/', (req, res) => {
  // res.status(200); // default
  res.render(
    'index', 
    { title: 'Главная страница', isHome: true }
  );
})

router.use('/courses', coursesRoutes);
router.use('/card', cardRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
