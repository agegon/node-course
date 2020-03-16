const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    //required: true
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: {
      items: [{
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        course: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Course'
        }
      }]
    },
    default: {
      items: [],
    }
  }
})

user.methods.addToCart = function(course) {
  if (!course) return;

  const items = [...this.cart.items];
  const idx = items.findIndex(item => item.course.toString() === course._id.toString());

  if (idx >= 0) {
    items[idx].count++;
  } else {
    items.push({
      course: course._id,
      count: 1
    })
  }

  this.cart.items = items;
  return this.save();
}

user.methods.removeFromCart = function(id) {
  if (!id) return;

  let items = [...this.cart.items];
  const idx = items.findIndex(item => item.course.toString() === id);

  if (items[idx].count > 1) {
    items[idx].count--;
  } else {
    items = items.filter(item => item.course.toString() !== id)
  }

  this.cart.items = items;
  return this.save();
}

user.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
}

module.exports = model('User', user);
