const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const csurf = require('csurf');
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);

const routes = require('./routes');
const userMiddleware = require('./middleware/user');
const variablesMiddleware = require('./middleware/variables');

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
const MONGO_URL = 'mongodb://localhost:27017/courses_shop';
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGO_URL,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store,
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}));

app.use(csurf());
app.use(flash());
app.use(variablesMiddleware);
app.use(userMiddleware);
app.use(routes);

async function start() {
  try {
    await mongoose.connect(MONGO_URL, { 
      useNewUrlParser: true,
      useFindAndModify: false, 
      useUnifiedTopology: true 
    });

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
