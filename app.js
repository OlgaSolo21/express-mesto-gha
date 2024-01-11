const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = express();

const router = require('./routes/index');
const { handleCenterError } = require('./middlewares/handleCenterError');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// централизованная обработка ошибок
app.use(handleCenterError);

// слушаем порт
app.listen(PORT);

// npm run lint -- --fix - чтобы фиксить ошибки с линтером
