const mongoose = require('mongoose')

const userData = new mongoose.Schema({
  name: {type: String,require: true},
  email: {type: String,require: true, unique: true},
  password: {type: String,require: true},
  cfpasword: {type: String,require: true},
  userType: {type: String,require: true,enum: ['guest', 'host']},
  favouriteHome:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Home",
  }],
  OTP:String,
  OTP_Ex:Date,
})
module.exports=mongoose.model("User",userData)