const mongoose = require("mongoose")

const bookmarkSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true
})

bookmarkSchema.index(
    { post: 1, user: 1 },
    { unique: true }
)

const bookmarkModel = mongoose.model("bookmarks", bookmarkSchema)

module.exports = bookmarkModel