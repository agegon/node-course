const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  card: {
    items: [{
      count: {
        type: Number,
        required: true,
        default: 1,
      },
      courseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
      }
    }]
  }
})

module.exports = model('User', user);
