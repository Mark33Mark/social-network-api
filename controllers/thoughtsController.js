
const { Thought, User } = require('../models');

const thoughtsController = {
  
  // == THOUGHTS ==================================================================================

  // == "C" create thought ============
  addThought({ params, body }, res ) 
  {
    console.log( { params, body } );

    // after a lot of trial and error this is way I ended up using to get the username from the 
    // the userId.
    // https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck

    User.findById(
            { _id: params.userId })
            .select('username')
            // .then( data =>  data.username );
            .then( data =>  
                    Thought.create( 
                      { 
                        thoughtText: body.thoughtText, 
                        userId: params.userId,
                        username:  data.username,
                      })
                      )

            .then( ({ _id }) => {
                return User.findOneAndUpdate(
                            { _id: params.userId }, 
                            { $push: { thoughts: _id } }, 
                            { new: true } );
              })

            .then( user => 
              !user 
                ? res.status(404).json({ 
                    message: 'Something has gone wrong, please confirm the user ID being used to create the thought.' 
                  })
                : res.json({ message:`${user.username} has successfully added a new thought`, user })
            )

      .catch(err => res.json(err));
    
  },
  

  // == "R" get all thoughts ==========
  getAllThoughts(req, res) 
  {
    Thought.find({})
      .sort({ _id: -1 })
      .select('-__v')
      .then( thoughts => res.json( thoughts ))

      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  

  // == "R" get thought by ID =========
  getSingleThought( { params }, res ) 
  {
    console.log( params );
    Thought.findOne({ _id: params.thoughtId })

    .populate({
      path: 'reactions',
      select: '-__v'
    })

    // excludes the version tag, selects everything else.
    .select('-__v')
    .then( thought => 

      !thought
        ? res.status(400).json({ message: 'Unable to find any thoughts for you.'})
        : res.json( thought )
    )

    .catch( err => res.status(400).json(err) );
  },


   // == "U" update a thought =========
  updateThought({ params, body }, res) 
  {
    console.log( { params, body } );

    Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            body, 
            { new: true, runValidators: true })
    .populate({
            path: 'reactions',
            select: '-__v'
    })
    .select('-__v')
    .then( thought => 

      !thought
        ? res.status(404).json({ message: 'Unable to find the thought with the id your requesting.' })
        : res.json( thought )
    )

    .catch(err => res.status(400).json(err));
  },


  // == "D" delete all thoughts ==========
  removeAllThoughts( req, res ) {

    Thought.deleteMany( {} )
  
      .then( removeThoughts => 
        !removeThoughts 
          ? res.status(404).json({ message: 'Unable to find any thoughts to delete.' })

          // found this method to set the array for all users to an empty array
          // https://stackoverflow.com/questions/41265930/how-to-remove-subdocument-inside-of-a-object-using-mongoose#41270093
          : User.updateMany( { $set: { thoughts: [] } } )
      )

        .then( user =>
        !user
          ? res.status(404).json({ message: 'Thoughts all deleted, but no users found' })
          : res.json({ message: 'Thoughts successfully deleted' })
      )
      
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },


  // == "D" delete a thought ==========
  removeThought({ params }, res) {

    console.log( {params} );

    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then( removeThought => 

          !removeThought   
            ? res.status(404).json({ message: `Unable to find the thought with the id you're requesting.` })

            // as there will be 1 thought against the id I decided on using 'updateOne' method.
            : User.updateOne( 
                { thoughts: params.thoughtId },
                { $pull: { thoughts: params.thoughtId } }
            )
      )

      .then( thought =>
        !thought
          ? res.status(404).json({
              message: 'Thought deleted, but no user thoughts were found',
            })
          : res.json({ message: `Your thought with id: ${ params.thoughtId } has been deleted.` })
      )

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  
  // == REACTIONS =================================================================================

  // == "C" create a reaction =========
  addReaction({ params, body }, res) 
  {
    console.log( { params, body } );

    // building up the body to include the userId - easier to manage 
    // when using $push to reactions array
    body.userId = params.userId;
    console.log(body);

    // using the same approach I worked out for the 'addThought' controller above, I'm using 
    // a nested query to find the username associated with the userId posting the reaction.
    User.findById(
      { _id: params.userId })
      .select('username')
      .then
        ( 
          data => 
                Thought.findOneAndUpdate(
                          { _id: params.thoughtId }, 
                          { $push: { reactions: 
                                      { 
                                        reactionBody: body.reactionBody, 
                                        userId: body.userId, 
                                        username: data.username, 
                                      } 
                                    } 
                                  }, 
                          { new: true, runValidators: true }
                      )
                      .populate({
                        path: 'reactions',
                        select: '-__v'
                      })
                      .select('reactions')
        )
    .then( thought => 

      !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json( thought )
    )

    .catch(err => res.json(err));

  },


  // To complete the CRUD, decided to add a read route for reactions. 
  // == "R" get all thoughts ==========
  getAllReactions(req, res) 
  {
    Thought.find({})
      .select('thoughtText reactions _id')
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then( reactions => res.json( reactions ))

      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },


  // Decided to add an 'Update' route for reactions.  Wanted to see if I could do it.
  // I referenced MongoDB to work it out:
  // https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/

  // == "U" update a reaction =========
  updateReaction({ params, body }, res) 
    {
      console.log( { params, body } );

      Thought.findOneAndUpdate(
              { _id: params.thoughtId }, 
              { $set: { "reactions.$[elem].reactionBody": body.reactionBody, } },
              { arrayFilters: [ { "elem.reactionId": { $eq: params.reactionId }}], new: true  })
      .populate({
              path: 'reactions',
              select: '-__v'
      })
      .select('-__v')
      .then( thought => 
  
        !thought
          ? res.status(404).json({ message: 'Unable to find the thought with the id your requesting.' })
          : res.json( { message: `You just updated a reaction with id: ${params.reactionId} from thought:`,  thought } )
      )
  
      .catch(err => res.status(400).json(err));
    },


  // == "D" delete a reaction =========
  removeReaction({ params }, res) {
    
    console.log( params );

    Thought.findOneAndUpdate( 
          { _id: params.thoughtId }, 
          { $pull: { reactions: { reactionId: params.reactionId } } }, 
          { new: true }
        )
        
    .then( thought => 
      !thought 
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : res.json({ message: `You just deleted a reaction with id: ${params.reactionId} from thought:`,  thought })
    )

    .catch(err => res.status(400).json(err));

  }
};

module.exports = thoughtsController;