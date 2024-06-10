const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  role:{
    type: String,
    required:true,
  },
  toAdmin: {
    type: Boolean,
  },
  content: {
    type: String,
    required: true
  }
},{timestamps:true});

mongoose.models = {}


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
