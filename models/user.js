// Создаём схему и модель для сущности пользователя.
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: {
      value: true,
      message: 'Поле является обязательным',
    }, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, 'Минимальная длина — 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длина — 30 символов'], // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    minlength: [2, 'Минимальная длина — 2 символа'],
    maxlength: [30, 'Максимальная длина — 30 символов'],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false, timestamps: true });

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
