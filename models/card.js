// Создаём схему и модель для сущности карточки.
const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    minlength: [2, 'Минимальная длина — 2 символа'],
    maxlength: [30, 'Максимальная длина — 30 символов'],
  },
  link: { // ссылка на картинку
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{ // список лайкнувших пост пользователей
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: { // дата создания карточки
    type: Date,
    default: Date.now,
  },
}, { versionKey: false, timestamps: true });

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
