const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// реализуем роуты signin/signup
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/,
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// Защитите API авторизацией(все что ниже - роуты, которым авторизация нужна)
app.use(auth);

// реализуем роуты user/cards
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// автотесты
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// обработчики ошибок

// обработчик ошибок celebrate
app.use(errors());

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

// слушаем порт
app.listen(PORT);

// npm run lint -- --fix - чтобы фиксить ошибки с линтером
