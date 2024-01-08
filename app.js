const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

const {createUser, login} = require('./controllers/users');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// Реализуйте временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '658884f60afee6f84e81b41f', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// реализуем роуты user/cards/signin/signup
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
//app.post('/signin', login);
app.post('/signup', createUser);

// автотесты
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// слушаем порт
app.listen(PORT);

// npm run lint -- --fix - чтобы фиксить ошибки с линтером
