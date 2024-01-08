// пишем контроллеры для юзера
const User = require('../models/user'); // импортируем модель
const bcrypt = require('bcryptjs'); // импортируем bcrypt

// POST /users — создаёт пользователя
  //дорабатываем по тз 14пр
module.exports.createUser = (req, res) => { // создаем пользователя User.create
  const { name, about, avatar, email, password } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {//ДУБЛИ ПОКА СОЗДАЮТСЯ
        return res.status(409).send({
          message: `Пользователь с таким email: ${email} уже зарегистрирован`,
        });
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res) => { // получаем всех пользователей User.find
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUsersId = (req, res) => { // получаем одного пользователя User.findById
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserProfile = (req, res) => { // обновляем имя-обо мне User.findByIdAndUpdate
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => { // обновляем аватар профиля User.findByIdAndUpdate
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
