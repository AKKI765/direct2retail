const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    gst :{
        type: String,
        required: false,
    },
    isMerchant : {
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

},{timestamps:true})


mongoose.models = {}

const User = mongoose.model('User', userSchema)

module.exports = User;