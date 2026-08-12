const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))

/* require routes */
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")

/* using routes */
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

module.exports = app;