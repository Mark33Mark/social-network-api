
const { Thought, User } = require('../models');
const { param } = require('../routes/api/thoughtRoutes');

const userController = {

  // == "C" create new user ===========
  createUser({ body }, res) 
  {
  
    User.create( body )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },


  // == "R" get all users =============
  getAllUsers(req, res) 
  {
    User.find({})

      .select('-__v')
      .sort({ username: 1 })
      .then(dbUserData => res.json(dbUserData))

      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // == "R" get user by ID ============
  getUserById({ params }, res) 
  {
    User.findOne({ _id: params.id })

    .populate({
      path: 'thoughts',
      select: '-__v'
    })

    .populate({
        path: 'friends',
        select: '-__v'
    })

    .select('-__v')

    .then( user => 
      !user
        ? res.status(400).json({ message: 'No user found with this id!'})
        : res.json( user )
    )

    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  
  // == "U" update a user =============
  updateUser( { params, body }, res ) 
  {
    User.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            { new: true }
          )
          
    .then( user => 
      !user
        ? res.status(404).json({ message: 'No user with this id was found' })
        : res.json( user )
    )

    .catch(err => res.status(400).json(err));

  },


  // == "D" delete a user =============
  deleteUser( { params }, res ) {

    console.log( { params } );

    User.findOneAndRemove({ _id: params.id })

      .then( user =>
        !user
          ? res.status(404).json({ message: "I can't find a user with that ID." })

          // $pull doesn't work for userId thoughts are not an array.  Decided to try
          // deleteMany method and it seems to work where it is deleting all thoughts
          // with the userId.
          : Thought.deleteMany(
              { userId: params.id }
            )
      )

      .then( course  =>

        !course
          ? res.status(404).json({
              message: 'User deleted, but no user thoughts were found',
            })
          : res.json({ message: 'User successfully deleted' })
      )

      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },


 // == FRIENDS ==============================================================================================


  // == add a Friend ==================
  addFriend ({ params }, res ) 
  {
    console.log("You're adding a new friend" );
    console.log( { params } );

    // doing this to stop a user friending themselves.  Tried different 
    // methods to validate / exclude this but ended up using this approach.
    // I ran out of time to work out how to pass a more informative error msg.
    const filter = ( params.id != params.friendId )
                    ? { _id: params.id } 
                    : { _id: "error" } ;

    User.findOneAndUpdate(
      filter,
      { $push: { friends: params.friendId } },

      // Mongoose validators for updates are off by default, 
      // runValidators: true activates validation.
      { new: true, runValidators: true }
    )

    .select('-__v')

    .then( user => 
      !user
        ? res.status(404).json({ message: "I can't find a user with that id." })
        : res.json( user )
    )

    .catch(err => res.json(err));

  }, 
  

  // == delete a Friend ===============
  deleteFriend( { params }, res ) 
  {
    console.log( { params } );

    User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true }
          )

    .select('-__v')

    .then( user => 
      !user
        ? res.status(404).json({ message: "I can't find a user with that id." })
        : res.json(user)
    )
    
    .catch(err => res.status(400).json(err));

  }
};

// ==========================================================================================================

module.exports = userController;

/* ==========================================================================================================
========================================================================================================== */