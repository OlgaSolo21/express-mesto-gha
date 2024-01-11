// Создаём схему и модель для сущности пользователя.
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const AuthorisationError = require('../errors/AuthorisationError');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина — 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длина — 30 символов'], // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    type: String,
    default: 'Исследователь',
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

userSchema.statics.findUserByCredential = function findOne(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // в случае аутентификации хеш пароля нужен
    .then((user) => {
      if (!user) { // не нашёлся — отклоняем промис
        throw new AuthorisationError('Неправильная почта или пароль');
      }
      return bcrypt.compare(password, user.password) // нашёлся — сравниваем хеши
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            throw new AuthorisationError('Неправильная почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
