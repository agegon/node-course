const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('user', 'email name');
  res.render(
    'courses', 
    { title: 'Список курсов', isCourses: true, courses }
  );
})

router.get('/add', auth, (req, res) => {
  res.render(
    'add', 
    { title: 'Добавить курс', isAdd: true, course: {} }
  );
})

router.post('/add', auth, async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      user: req.user
    });

    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  const course = await Course.findById(req.params.id);

  res.render(
    'add', 
    { title: 'Редактирование курса', course }
  );
})

router.post('/:id/edit', auth, async (req, res) => {
  if (req.query.allow) {
    await Course.findByIdAndUpdate(req.params.id, req.body);
  }

  return res.redirect('/courses');
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.render(
    'course',
    {
      title: course ? course.title : 'Курс не найден',
      course
    }
  )
})

router.delete('/:id', auth, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);

  res.json({ data: null });
})

module.exports = router;
