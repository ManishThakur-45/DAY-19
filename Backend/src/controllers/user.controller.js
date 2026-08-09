const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


async function followUserController(req, res) {
    

    const followerUsername = req.user.username
    const followeeUsername  = req.params.username

    if(followeeUsername==followerUsername){
        return res.status(400).json({
            message:"You cannot follow yourslf"
        })
    }

    const isFollweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFollweeExists){
        return res.status(404).json({
            message:"User you are trying to follow does not exist"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message:`You already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
       message: `Follow request sent to ${followeeUsername}`,
        follow : followRecord
    })

}


async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername  = req.params.username

     const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

        if(!isUserFollowing){
            return res.status(200).json({
                message: `You are not following ${followeeUsername}`

            })
        }

    await followModel.findByIdAndDelete(isUserFollowing._id)  
    
    res.status(200).json({
        message:`You have unfollowed ${followeeUsername}`
    })
}


async function getFollowRequestsController(req, res) {

    const receiverUsername = req.user.username

    const requests = await followModel.find({
        followee: receiverUsername,
        status: "pending"
    })

    res.status(200).json({
        message: "Follow requests fetched successfully",
        requests: requests
    })
}

async function acceptFollowRequestController(req, res) {

    const receiverUsername = req.user.username
    const senderUsername = req.params.username

    const followRequest = await followModel.findOne({
        follower: senderUsername,
        followee: receiverUsername,
        status: "pending"
    })

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    followRequest.status = "accepted"

    await followRequest.save()

    res.status(200).json({
        message: `You accepted ${senderUsername}'s follow request`,
        follow: followRequest
    })
}

async function rejectFollowRequestController(req, res) {

    const receiverUsername = req.user.username
    const senderUsername = req.params.username

    const followRequest = await followModel.findOne({
        follower: senderUsername,
        followee: receiverUsername,
        status: "pending"
    })

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    followRequest.status = "rejected"

    await followRequest.save()

    res.status(200).json({
        message: `You rejected ${senderUsername}'s follow request`,
        follow: followRequest
    })
}


module.exports = {
    followUserController,
    unfollowUserController,
    getFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController
}