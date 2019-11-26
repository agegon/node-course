const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.render(
    'courses', 
    { title: 'Список курсов', isCourses: true }
  );
})

router.get('/add', (req, res) => {
  res.render(
    'add', 
    { title: 'Добавить курс', isAdd: true }
  );
})

router.post('/add', (req, res) => {
  console.log(req.body);

  res.redirect('/courses');
})

module.exports = router;
