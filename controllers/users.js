// пишем контроллеры для юзера
const User = require('../models/user'); // импортируем модель

module.exports.createUser = (req, res) => { // создаем пользователя User.create
  const { name, about, avatar } = req.body;
  console.log(req.body, 'req.body');
  console.log(req.user._id); // _id станет доступен
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
