const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const routes = require('./routes');

const User = require('./models/user');

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e676785260eda31ac1b40a7');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});
app.use(routes);

async function start() {
  try {
    const url = 'mongodb://localhost:27017/courses_shop';
    await mongoose.connect(url, { 
      useNewUrlParser: true,
      useFindAndModify: false, 
      useUnifiedTopology: true 
    });

    const user = await User.findOne();
    if (!user) {
      const newUser = new User({
        email: 'example@email.com',
        name: 'User',
        card: {
          items: []
        }
      })

      await newUser.save();
    }

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (err) {
    console.log(err);
  }
}

start();
