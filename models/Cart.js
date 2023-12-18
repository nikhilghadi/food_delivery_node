const mongoose = require('mongoose')
const {Schema} = mongoose
const CartSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true,
  },
  cart_items:{
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('cart', CartSchema)