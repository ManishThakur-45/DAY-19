import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: <Feed />
    },
    {
        path: "/create-post",
        element: <CreatePost />
    }
])