// пишем контроллеры для юзера
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем jwt token модуль
const User = require('../models/user'); // импортируем модель
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

// POST /users — создаёт пользователя
// дорабатываем по тз 14пр
module.exports.createUser = (req, res, next) => { // создаем пользователя User.create
  const {
    name, about, avatar, email,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(201).send({ // В ответе убираем password
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) { // ДУБЛИ СОЗДАЮТСЯ без celebrate, с ним все валидно
        next(new ConflictError(`Пользователь с email: ${email} уже существует`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => { // получаем всех пользователей User.find
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUsersId = (req, res, next) => { // получаем одного пользователя User.findById
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь по _id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      } else { next(err); }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserProfile = (req, res, next) => { // обновляем профиль User.findByIdAndUpdate
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь по _id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Данные введены некорректно'));
      } else { next(err); }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res, next) => { // обновляем аватар User.findByIdAndUpdate
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь по _id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
        return;
      } next(err);
    });
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Создайте контроллер login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredential(email, password)
    .then((user) => {
      const token = jwt.sign( // создадим токен
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token }); // вернём токен
    })
    .catch(next);
};
