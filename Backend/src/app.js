const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")



const app = express();
// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes");
const postSchema = require('./models/post.model');
const userRouter = require("./routes/user.routes")


app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/user", userRouter)


module.exports = app;