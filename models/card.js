// Создаём схему и модель для сущности карточки.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { // ссылка на картинку
    type: String,
    required: true,
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
module.exports = mongoose.model('card', userSchema);
