 const userModel = require('../models/user.model');
 const bcrypt = require("bcryptjs")
 const jwt = require('jsonwebtoken');
 
 
 async function  registerControlller(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

//   const isUsernameExistsByEmail = await userModel.findOne({ email});

//   if (isUsernameExistsByEmail) {
//     return res.status(409).json({
//          message: "Email already exists with same email"
//          });
//   }

//     const isUsernameExistsByUsername = await userModel.findOne({ username });
    
// if (isUsernameExistsByUsername) {
//     return res.status(409).json({
//          message: "Username already exists with same username"
//          });
//   }


const isUserAlreadyExists = await userModel.findOne({ 
    $or: [{ email },
         { username }]
 });
if (isUserAlreadyExists) {
    return res.status(409).json({
         message: "User already exists"+(isUserAlreadyExists.email===email ?
         "Email alraeady exists" : "Username already exists")
         });
  }

const hash =await bcrypt.hash(password, 10)

const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash
  });

  const token = jwt.sign({
    id:user._id,
    username: user.username
  },process.env.JWT_SECRET,{expiresIn: "1d"}
)

res.cookie("token", token);

return res.status(201).json({
  message: "User Registered Successfully",
  user: {
    email: user.email,
    username: user.username,
    bio: user.bio,
    profileImage: user.profileImage
  }
});

};

async  function loginController(req, res) {
  const { username, email, password} = req.body

const user = await userModel.findOne({
  $or:[
    {
      username: username
    },
    {
      email: email
    }
  ]
})

if(!user){
  return res.status(404).json({
    massage:"User noot found"
  })
}

const isPasswoedValid = await bcrypt.compare(password, user.password)
    if(!isPasswoedValid){
      return res.status(401).json({
        massage:"Password invalid"
      })
    }

    const token = jwt.sign(
      {id:user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
     )

     res.cookie("token",token)

     res.status(200).json({
      massage:"User loggedIn successfully",
      user: {
    email: user.email,
    username: user.username,
    bio: user.bio,
    profileImage: user.profileImage
  }
     })

}

module.exports={
    registerControlller,
    loginController
}

