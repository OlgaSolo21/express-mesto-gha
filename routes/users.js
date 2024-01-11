const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUsersId, updateUserProfile, updateAvatar, getUserMe,
} = require('../controllers/users');
const urlRegex = require('../utils/constans');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  getUsersId,
);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
}), updateAvatar);

module.exports = router;
