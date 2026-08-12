const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    text: {
        type: String,
        required: [true, "Comment is required"],
        trim: true
    }
}, {
    timestamps: true
})

const commentModel = mongoose.model("comments", commentSchema)

module.exports = commentModel