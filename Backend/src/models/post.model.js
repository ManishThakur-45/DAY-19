const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUri:{
        type:String,
        required:[true, "imgUrl is require for creating an post"]
    },

    user:{
        ref:"users",
        type: mongoose.Schema.Types.ObjectId,
        required:[true,"user id is required for creating an post"]
    }
})

const postmodel = mongoose.model("post", postSchema)

module.exports = postmodel