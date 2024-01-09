const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth')

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// реализуем роуты signin/signup
app.post('/signin', login);
app.post('/signup', createUser);

// Защитите API авторизацией(все что ниже роуты, которым авторизация нужна)
app.use(auth);

// реализуем роуты user/cards
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));


// автотесты
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// слушаем порт
app.listen(PORT);

// npm run lint -- --fix - чтобы фиксить ошибки с линтером
