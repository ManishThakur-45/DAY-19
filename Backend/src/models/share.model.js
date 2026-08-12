const mongoose = require("mongoose")

const shareSchema = new mongoose.Schema({
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

const shareModel = mongoose.model("shares", shareSchema)

module.exports = shareModel