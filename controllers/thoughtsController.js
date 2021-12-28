const { Thought, User } = require('../models');

const thoughtsController = {
  
  // addThought,
  addThought({ params, body }, res ) 
  {
    Thought.create( body )

    .then(({ _id }) => {
      return User.findOneAndUpdate(
                    { _id: params.userId }, 
                    { $push: { thoughts: _id } }, 
                    { new: true, runValidators: true } );
    })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'Unable to find any thoughts for you.' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },
  

  // getAllThoughts
  getAllThoughts(req, res) 
  {
    Thought.find({})
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },
  

  // getSingleThought,
  getSingleThought( { params }, res ) 
  {
    Thought.findOne({ _id: params.id })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    // selects everything except the versioning tag
    .select('-__v')
    .then(dbThoughtData => {

      if (!dbThoughtData) {
        res.status(400).json({ message: 'Unable to find any thoughts for you.'});
        return;

      }
      res.json(dbThoughtData);
    })
    .catch(err => {res.status(400).json(err)});
  },


  // updateThought
  updateThought({ params, body }, res) 
  {
    Thought.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            { new: true, runValidators: true })
    .populate({
            path: 'reactions',
            select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {

      if (!dbThoughtData) {
        res.status(404).json({ message: 'Unable to find the thought with the id your requesting.' });
        return;
      }

      res.json(dbThoughtData);

    })

    .catch(err => res.status(400).json(err));
  },


  // removeThought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then( removeThought => {

        if ( !removeThought ) {  
          return res.status(404).json({ message: 'Unable to find the thought with the id your requesting.' }
          );
        }
        return User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.id } }, 
              { new: true }
            );
    })

    .then( dbThoughtData => {

      if (!dbThoughtData) {
        res.status(404).json({ message: 'Unable to find the thought with the id your requesting.' });
        return;

      }

      res.json(dbThoughtData);

    })
    .catch(err => res.json(err));
  },


  // addReaction,
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
              { _id: params.thoughtId }, 
              { $push: { reactions: body } }, 
              { new: true, runValidators: true }
            )
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },


  // removeReaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate( 
          { _id: params.thoughtId }, 
          { $pull: { reactions: { reactionId: params.reactionId } } }, 
          { new: true }
        )
        
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtsController;