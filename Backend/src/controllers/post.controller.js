const  postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")
const bookmarkModel = require("../models/bookmark.model")
const commentModel = require("../models/comment.model")
const shareModel = require("../models/share.model")




const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req, res) {

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}

async function getPostController(req, res) {



    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })

}

async function getPostDetailsController(req, res) {


    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched  successfully.",
        post
    })

}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post liked successfully.",
        like
    })

}


async function unLikePostController(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (!isLiked) {
        return res.status(400).json({
            message: "Post didn't like"
        })
    }

    await likeModel.findOneAndDelete({ _id: isLiked._id })

    return res.status(200).json({
        message: "post un liked successfully."
    })
}

async function bookmarkPostController(req, res) {

    const postId = req.params.postId
    const userId = req.user.id

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const alreadyBookmarked = await bookmarkModel.findOne({
        post: postId,
        user: userId
    })

    if (alreadyBookmarked) {
        return res.status(400).json({
            message: "Post already bookmarked."
        })
    }

    const bookmark = await bookmarkModel.create({
        post: postId,
        user: userId
    })

    return res.status(201).json({
        message: "Post bookmarked successfully.",
        bookmark
    })
}

async function unBookmarkPostController(req, res) {

    const postId = req.params.postId
    const userId = req.user.id

    const bookmark = await bookmarkModel.findOne({
        post: postId,
        user: userId
    })

    if (!bookmark) {
        return res.status(400).json({
            message: "Post is not bookmarked."
        })
    }

    await bookmarkModel.findByIdAndDelete(bookmark._id)

    return res.status(200).json({
        message: "Post removed from bookmarks."
    })
}


async function getFeedController(req, res) {

    const user = req.user

    const posts = await Promise.all(
        (await postModel.find({}).populate("user").lean())
            .map(async (post) => {

                const isLiked = await likeModel.findOne({
                    user: user.username,
                    post: post._id
                })

                post.isLiked = Boolean(isLiked)

                const isBookmarked = await bookmarkModel.findOne({
                    user: user._id,
                    post: post._id
                })

                post.isBookmarked = Boolean(isBookmarked)

                const commentCount = await commentModel.countDocuments({
                    post: post._id
                })

                post.commentCount = commentCount

                const shareCount = await shareModel.countDocuments({
                    post: post._id
                })

                post.shareCount = shareCount

                return post
            })
    )

    res.status(200).json({
        message: "posts fetched successfully.",
        posts
    })
}

async function addCommentController(req, res) {

    const postId = req.params.postId
    const userId = req.user.id

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const text = req.body?.text

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Comment text is required."
        })
    }

    const comment = await commentModel.create({
        post: postId,
        user: userId,
        text: text.trim()
    })

    return res.status(201).json({
        message: "Comment added successfully.",
        comment
    })
}


async function getCommentsController(req, res) {

    const postId = req.params.postId
    const userId = req.user.id

    const comments = await commentModel
        .find({ post: postId })
        .populate("user", "username profileImage")
        .sort({ createdAt: -1 })
        .lean()

    const commentsWithOwner = comments.map((comment) => {

        comment.isOwner =
            comment.user &&
            comment.user._id.toString() === userId.toString()

        return comment
    })

    return res.status(200).json({
        message: "Comments fetched successfully.",
        comments: commentsWithOwner
    })
}

async function deleteCommentController(req, res) {

    const commentId = req.params.commentId
    const userId = req.user.id

    const comment = await commentModel.findById(commentId)

    if (!comment) {
        return res.status(404).json({
            message: "Comment not found."
        })
    }

    if (comment.user.toString() !== userId) {
        return res.status(403).json({
            message: "You can delete only your own comment."
        })
    }

    await commentModel.findByIdAndDelete(commentId)

    return res.status(200).json({
        message: "Comment deleted successfully."
    })
}

async function sharePostController(req, res) {

    const postId = req.params.postId
    const userId = req.user.id

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    await shareModel.create({
        post: postId,
        user: userId
    })

    const shareUrl = `${req.protocol}://${req.get("host")}/posts/${postId}`

    return res.status(200).json({
        message: "Post shared successfully.",
        shareUrl
    })
}




module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unLikePostController,
    bookmarkPostController,
    unBookmarkPostController,
    addCommentController,
    getCommentsController,
    deleteCommentController,
    sharePostController
}