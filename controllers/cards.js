// пишем контроллеры для карточек
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id; // владелец карточки
  Card.create({ name, link, owner })// тут будет также _id новой карточки (см Postman)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
    })
    .catch(next);
};

// GET /cards — возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Карточка другого пользователя, ее нельзя удалить'));
      }
      Card.deleteOne(card)
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (!card) {
            next(new NotFoundError('Карточка с указанным _id не найдена'));
          } else if (err.name === 'CastError') {
            next(new BadRequest('Данные введены некорректно'));
          }
        });
    })
    .catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены некорректно'));
      }
    })
    .catch(next);
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.status(200).send(card);
    })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     next(new BadRequest('Данные введены некорректно'));
    //   }
    // })
    .catch(next);
};
