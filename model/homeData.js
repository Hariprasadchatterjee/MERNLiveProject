
const mongoose = require("mongoose");
// const Favourite = require("./favData")

const homeScema = new mongoose.Schema({
  home: {type:String , required:true},
  location: {type:String , required:true},
  price: {type:Number , required:true},
  rating: {type:Number , required:true},
  image: {type:String },

  host:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
  
})

// homeScema.pre("findOneAndDelete",async function (next) {
//   const favId =this.getQuery()["_id"];
//   await Favourite.findOneAndDelete(favId)
//   next();
// })

module.exports = mongoose.model("Home",homeScema)
  