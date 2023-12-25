const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

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

// реализуем роуты user
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// слушаем порт
app.listen(PORT);

// npm run lint -- --fix - чтобы фиксить ошибки с линтером
