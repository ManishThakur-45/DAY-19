const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/auth.middleware")

/**
 * @route POST /api/posts
 * @description Create a post with content and image
 * @access Private
 */
postRouter.post(
    "/",
    upload.single("chacha"),
    identifyUser,
    postController.createPostController
)

/**
 * @route GET /api/posts
 * @description Get all posts created by the current user
 * @access Private
 */
postRouter.get(
    "/",
    identifyUser,
    postController.getPostController
)

/**
 * @route GET /api/posts/details/:postId
 * @description Get details of a specific post
 * @access Private
 */
postRouter.get(
    "/details/:postId",
    identifyUser,
    postController.getPostDetailsController
)

/**
 * @route POST /api/posts/like/:postId
 * @description Like a post
 * @access Private
 */
postRouter.post(
    "/like/:postId",
    identifyUser,
    postController.likePostController
)

/**
 * @route POST /api/posts/unlike/:postId
 * @description Unlike a post
 * @access Private
 */
postRouter.post(
    "/unlike/:postId",
    identifyUser,
    postController.unLikePostController
)

/**
 * @route GET /api/posts/feed
 * @description Get all posts for feed
 * @access Private
 */
postRouter.get(
    "/feed",
    identifyUser,
    postController.getFeedController
)

/**
 * @route POST /api/posts/bookmark/:postId
 * @description Bookmark/Save a post
 * @access Private
 */
postRouter.post(
    "/bookmark/:postId",
    identifyUser,
    postController.bookmarkPostController
)

/**
 * @route POST /api/posts/unbookmark/:postId
 * @description Remove a post from bookmarks
 * @access Private
 */
postRouter.post(
    "/unbookmark/:postId",
    identifyUser,
    postController.unBookmarkPostController
)

/**
 * @route POST /api/posts/comment/:postId
 * @description Add a comment to a post
 * @access Private
 */
postRouter.post(
    "/comment/:postId",
    identifyUser,
    postController.addCommentController
)

/**
 * @route GET /api/posts/comments/:postId
 * @description Get all comments of a post
 * @access Private
 */
postRouter.get(
    "/comments/:postId",
    identifyUser,
    postController.getCommentsController
)

/**
 * @route DELETE /api/posts/comment/:commentId
 * @description Delete a comment created by the current user
 * @access Private
 */
postRouter.delete(
    "/comment/:commentId",
    identifyUser,
    postController.deleteCommentController
)

/**
 * @route POST /api/posts/share/:postId
 * @description Share a post and generate a shareable URL
 * @access Private
 */
postRouter.post(
    "/share/:postId",
    identifyUser,
    postController.sharePostController
)

module.exports = postRouter