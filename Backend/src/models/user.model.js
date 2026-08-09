const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [ true, "Username is required"],
    unique:[ true ,"Username already exists"]
  },
  email: {
    type: String,
    required: [ true, "Email is required"],
    unique:[ true ,"Email already exists"]
  },
  password: {
    type: String,
    required: [ true, "Password is required"]
  }, 
  bio:String,
 profileImage: {
    type: String,
    default: "https://ik.imagekit.io/za1b5udrr/Test_rC3l08U-e?updatedAt=1772518187861"
 }


});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;