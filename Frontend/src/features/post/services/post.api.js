import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getFeed() {
    const response = await api.get("/api/posts/feed")
    return response.data
}

export async function createPost(imageFile, caption) {

    const formData = new FormData()

    formData.append("chacha", imageFile)
    formData.append("caption", caption)

    const response = await api.post("/api/posts", formData)

    return response.data
}

export async function likePost(postId) {
    const response = await api.post("/api/posts/like/" + postId)
    return response.data
}

export async function unLikePost(postId) {
    const response = await api.post("/api/posts/unlike/" + postId)
    return response.data
}

export async function bookmarkPost(postId) {
    const response = await api.post("/api/posts/bookmark/" + postId)
    return response.data
}

export async function unBookmarkPost(postId) {
    const response = await api.post("/api/posts/unbookmark/" + postId)
    return response.data
}

export async function addComment(postId, text) {

    const response = await api.post(
        "/api/posts/comment/" + postId,
        {
            text: text
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    return response.data
}

export async function getComments(postId) {

    const response = await api.get(
        "/api/posts/comments/" + postId
    )

    return response.data
}

export async function deleteComment(commentId) {

    const response = await api.delete(
        "/api/posts/comment/" + commentId
    )

    return response.data
}