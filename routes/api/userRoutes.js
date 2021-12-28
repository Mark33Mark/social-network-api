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

// /api/user
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

// /api/user/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router
  .route('/:id/friend/:friendId')
  .put(addFriend)
  .delete(deleteFriend);

module.exports = router;
