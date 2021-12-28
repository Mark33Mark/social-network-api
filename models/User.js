const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    
    email: {
      type: String,
      unique: true,
      required: true,
      match: /\b^([\da-z\._%+-]+)@([\da-z\.-]+)\.([a-z]{2,10})\b/i, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    thoughts: [
      {
      type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    // prevent virtuals creating duplicates of _id as `id`
    id: false
  }
);

// virtual to get friends array length.
userSchema.virtual('userFriendCount').get( function () {
  return this.friends.length;
});


const User = model('User', userSchema);
module.exports = User;
