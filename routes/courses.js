const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.getAll();
  res.render(
    'courses', 
    { title: 'Список курсов', isCourses: true, courses }
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

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);

  res.render(
    'course',
    {
      title: course ? course.title : 'Курс не найден',
      course
    }
  )
})

module.exports = router;
