const { Schema, model, Types } = require('mongoose');
const dateFormat               = require('../utils/dateFormat');

const reactionSchema = new Schema
(
  {
    _id: 
    {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },

    reactionBody: 
    {
        type: String,
        required: true,
        maxlength: 280,
    },

    // decided to use userId to get the username as userId used to
    // create the thought.
    userId: 
    {
        type: String,
        required: true,
    },

    username: 
    {
      type: String,
      required: true,
    },

    createdAt: String,
    updatedAt: String,
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
    // prevents virtuals creating duplicates of _id as `id`
    id: false
  }
);


const thoughtSchema = new Schema
(
  { 

    thoughtText: 
    {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1
    },
    
    // decided to use userId to get the username as the userId part of
    // creating the thought.
    userId: 
    {
        type: String,
        required: true,
    },

    username: 
    {
      type: String,
      required: true,
    },

    createdAt: String,
    updatedAt: String,

    reactions: [reactionSchema],

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
thoughtSchema.virtual('id').get( function () {
  return this._id;
});

// virtual to count reactions
thoughtSchema.virtual('reactionCount').get( function () {
  return this.reactions.length;
});


const Thought = model('Thought', thoughtSchema);
module.exports = Thought;