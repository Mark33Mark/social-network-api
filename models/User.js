const { Schema, model }   = require('mongoose');
const dateFormat          = require('../utils/dateFormat');

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

    createdAt: String,
    updatedAt: String,

    thoughts: [
      {
      type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  {
    timestamps: 
    { 
      currentTime: () => dateFormat.date_formatter(Date.now()) 
    },
    toJSON: 
    {
      virtuals: true,
      getters: true,
      // see virtual 'id' below, transform used to remove _id.
      transform: function(doc, ret) 
      {
        delete ret._id;
      }
    },
    // prevent virtuals creating duplicates of _id as `id`
    id: false
  }
);

// came across this to remove the _id and use id instead.
// https://stackoverflow.com/questions/28566841/mongoose-query-remove-id-attribute-keep-virtual-attribute-id-in-results#38453071
userSchema.virtual('id').get(function () {
  return this._id;
});

// virtual to get friends array length.
userSchema.virtual('friendCount').get( function () {
  return this.friends.length;
});

const User = model('User', userSchema);
module.exports = User;
