const router = require('express').Router();
const {
  addThought,        // C
  getAllThoughts,    // R
  getSingleThought,  // R
  updateThought,     // U
  removeAllThoughts, // D
  removeThought,     // D

  addReaction,       // C
  getAllReactions,   // R
  updateReaction,    // U 
  removeReaction     // D

} = require('../../controllers/thoughtsController');

// == THOUGHTS ============================

// ========================================

// /api/thoughts
router
  .route('/')
  .get(getAllThoughts)
  .delete(removeAllThoughts);

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
// == REACTIONS ===========================

// /api/thoughts/reactions/all
router
  .route('/reactions/all')
  .get(getAllReactions);

// ========================================

// changed the route slightly to have /reaction first 
// followed by the :thoughtId and :userId
// /api/thoughts/reaction/:thoughtId/:userId
router
  .route('/reaction/:thoughtId/:userId')
  .post(addReaction);

// ========================================

// /api/thoughts/reaction/:thoughtId/:reactionId
router
  .route('/reaction/:thoughtId/:reactionId')
  .put(updateReaction)
  .delete(removeReaction);

// ========================================

module.exports = router;
