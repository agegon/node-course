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
const fileMiddleware = require('./middleware/file');
const variablesMiddleware = require('./middleware/variables');
const noRouteHandler = require('./middleware/error');
const keys = require('./keys');

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs'),
})

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGO_URL,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store,
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(fileMiddleware.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(variablesMiddleware);
app.use(userMiddleware);
app.use(routes);

app.use(noRouteHandler);

async function start() {
  try {
    await mongoose.connect(keys.MONGO_URL, { 
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
