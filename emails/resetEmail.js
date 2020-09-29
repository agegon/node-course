const keys = require("../keys")

module.exports = function(to, token) {
  return {
    to,
    from: keys.EMAIL_FROM,
    subject: 'Восстановление пароля',
    html: `
      <h1>Вы забыли пароль?</h1>
      <p>Если нет, то проигнорируйте данное письмо</p>
      <p>Для восстановления пароля перейдите по ссылке</p>
      <p><a href="${keys.BASE_URL}/recover/${token}">Восстановить</a></p>
      <hr />
      <a href="${keys.BASE_URL}">Магазин курсов</a>
    `,
  }
}
