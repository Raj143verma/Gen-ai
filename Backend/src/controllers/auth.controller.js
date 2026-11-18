const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description Register a new user,expect name,email,password in the request body
 * @access public
 */


async function registerUserController(req, res) { 

    const { username, email,password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ 
            message: "Please provide username, email and password"
         });
}

const isUserAlreadyRegistered = await userModel.findOne({
    $or: [{ username}, { email}]
})
  if (isUserAlreadyRegistered) {
    return res.status(400).json({
        message: "User with the same username or email already exists"
    })
  }
  const hash = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username,
    email,
    password: hash  
  })

  const token = jwt.sign(
    { id: user._id, username: user.username }, 
    process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

      res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });


}

/**
 * @name loginUserController
 * @description Login a user, expect email and password in the request body
 * @access public
 */

async function loginUserController(req, res) {
    const { email, password} = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign(
    { id: user._id, username: user.username }, 
    process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "User logged in successfully",
        user: { 
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}



/**
 * @name logoutUserController
 * @description Logout a user by clearing the token from cookie and adding the token in blacklist
 *  @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully" 
    })
    }

    /**
     * @name getMeController
     * @description Get the details of the logged in user.
     * @access private

     */
async function getMeController(req, res) {  
    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,  
            username: user.username,
            email: user.email     
        }
    })
}




module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
