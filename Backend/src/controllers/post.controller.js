const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function createPostController(req, res) {
    console.log(req.body, req.file);



 const file = await imagekit.files.upload({
            file: await toFile(req.file.buffer, req.file.originalname),
            fileName: req.file.originalname,
            folder: "Manish-Backend"
        });
        const post = await postModel.create({
            caption: req.body.caption,
            imgUri: file.url,
            user: req.user.id
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    }

async function getPostController(req, res) {
    const token = req.cookies.token;


    const userId = req.user.id;

    const posts = await postModel.find({
        user: userId
    });

    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    });
}


async function getPostDetailsController(req, res) {
    const token = req.cookies.token

   

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post Not Found"
        })
    }

    const isValidUser = post.user.toString() === userId

    if(!isValidUser){
        return res.status(403).json({
           message:" Forbidden Content"
        })
    }

    return res.status(200).json({
        message:"Post fetched successfully",
        post
    })

}

async function likePostController(req, res) {
    
    const username = req.user.username
    const postId = req.params.postId

     const post = await postModel.findById(postId)

     if(!post){
        return res.status(404).json({
            message:"Post Not Found"
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message:"post liked successfully",
        like
    })

}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController
}