const { Schema, model } = require('mongoose');

const order = new Schema({
  courses: [{
    course: {
      type: Object,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('Order', order);
