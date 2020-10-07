const { Router } = require('express');
const { validationResult } = require('express-validator');

const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

const router = Router();

const isOwner = (course, user) => course?.user.toString() === user?._id.toString();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('user', 'email name');
    res.render(
      'courses', 
      { 
        title: 'Список курсов',
        isCourses: true,
        userId: req.user?._id.toString(),
        courses
      }
    );
  } catch (err) {
    console.log(err)
  }
})

router.get('/add', auth, (req, res) => {
  res.render(
    'add', 
    { title: 'Добавить курс', isAdd: true, course: {} }
  );
})

router.post('/add', auth, courseValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    const { title, price, img } = req.body;

    if (!errors.isEmpty()) {
      return res.status('422').render('add', {
        title: 'Добавить курс', 
        isAdd: true, 
        course: { title, price, img },
        error: errors.array()[0].msg,
      })
    }

    const course = new Course({
      title,
      price,
      img,
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

  try {
    const course = await Course.findById(req.params.id);

    if (!isOwner(course, req.user)) {
      return res.redirect('/courses');
    }

    res.render(
      'add', 
      { title: 'Редактирование курса', course }
    );
  } catch (err) {
    console.log(err)
  }
})

router.post('/:id/edit', auth, courseValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    const { title, price, img } = req.body;

    if (!errors.isEmpty()) {
      return res.status('422').render('add', {
        title: 'Редактирование курса',
        course: { title, price, img, id: req.params.id },
        error: errors.array()[0].msg,
      })
    }

    if (req.query.allow) {
      const course = await Course.findById(req.params.id);
      if (!isOwner(course, req.user)) {
        return res.redirect('/courses');
      }
      Object.assign(course, req.body);
      await course.save();
    }

    return res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    res.render(
      'course',
      {
        title: course ? course.title : 'Курс не найден',
        course
      }
    )
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
