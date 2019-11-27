const { Router } = require('express');
const Course = require('../models/course');

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

router.post('/add', async (req, res) => {
  const course = new Course(req.body);
  await course.save();

  res.redirect('/courses');
})

module.exports = router;
