const router = require('express').Router();

// call the controller functions
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require ('../../controllers/usersController');

// /api/users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// /api/users/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/:id/friend/:friendId
router
  .route('/:id/friend/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;
