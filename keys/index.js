module.exports = {
  BASE_URL: 'http://localhost:3000',
  EMAIL_FROM: 'couses-shop@mail.com',
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_API_KEY,
  MONGO_URL: 'mongodb://localhost:27017/courses_shop',
  SESSION_SECRET: process.env.SESSION_SECRET || 'some secret value',
}
