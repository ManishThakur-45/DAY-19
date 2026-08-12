import {
    getFeed,
    createPost,
    likePost,
    unLikePost,
    bookmarkPost,
    unBookmarkPost,
    addComment,
    getComments,
    deleteComment
} from "../services/post.api"

import { useContext, useEffect } from "react"
import { PostContext } from "../post.context"

export const usePost = () => {

    const context = useContext(PostContext)

    const {
        loading,
        setLoading,
        post,
        setPost,
        feed,
        setFeed
    } = context

    const handleGetFeed = async () => {
        setLoading(true)

        const data = await getFeed()

        setFeed(data.posts.reverse())

        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)

        const data = await createPost(imageFile, caption)

        setFeed([data.post, ...feed])

        setLoading(false)
    }

    const handleLike = async (post) => {

        const data = await likePost(post)

        await handleGetFeed()
    }

    const handleUnLike = async (post) => {

        const data = await unLikePost(post)

        await handleGetFeed()
    }

    const handleBookmark = async (post) => {

        const data = await bookmarkPost(post)

        await handleGetFeed()
    }

    const handleUnBookmark = async (post) => {

        const data = await unBookmarkPost(post)

        await handleGetFeed()
    }

    const handleAddComment = async (postId, text) => {

        const data = await addComment(postId, text)

        await handleGetFeed()

        return data
    }

    const handleGetComments = async (postId) => {

        const data = await getComments(postId)

        return data.comments
    }

    const handleDeleteComment = async (commentId) => {

        const data = await deleteComment(commentId)

        return data
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return {
        loading,
        feed,
        post,
        handleGetFeed,
        handleCreatePost,
        handleLike,
        handleUnLike,
        handleBookmark,
        handleUnBookmark,
        handleAddComment,
        handleGetComments,
        handleDeleteComment
    }
}