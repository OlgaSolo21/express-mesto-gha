const router = require('express').Router();

const {
  createUser, getUsers, getUsersId, updateUserProfile, updateAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUsersId);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
