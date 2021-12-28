const router = require('express').Router();
const {
  addThought,       // C
  getAllThoughts,   // R
  getSingleThought, // R
  updateThought,    // U
  removeThought,    // D

  addReaction, 
  removeReaction

} = require('../../controllers/thoughtsController');

// ========================================

// /api/thoughts
router
  .route('/')
  .get(getAllThoughts);

// ========================================

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(removeThought);

// ========================================

// /api/thoughts/:userId
router
.route('/:userId')
.post(addThought);

// ========================================

// /api/thought/:thoughtId/reactions
router
  .route('/:thoughtId/reaction')
  .post(addReaction);

// ========================================

// /api/thoughts/:thoughtId/:reactionId
router
  .route('/:thoughtId/reaction/:reactionId')
  .delete(removeReaction);

// ========================================

module.exports = router;
