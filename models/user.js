// Создаём схему и модель для сущности пользователя.
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: "Жак-Ив Кусто",
    minlength: [2, 'Минимальная длина — 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длина — 30 символов'], // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    type: String,
    default: "Исследователь",
    minlength: [2, 'Минимальная длина — 2 символа'],
    maxlength: [30, 'Максимальная длина — 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Поле email является обязательным',
    },
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле password является обязательным',
    },
    select: false,
  },
}, { versionKey: false, timestamps: true });

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
