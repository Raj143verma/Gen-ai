const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const { OAuth2Client } = require("google-auth-library");

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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "User registered successfully",
        token,
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "User logged in successfully",
        token,
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
    const token = req.cookies.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

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




/**
 * @name googleAuthController
 * @description Authenticate or register a user using Google OAuth (ID token or access token)
 * @access public
 */
async function googleAuthController(req, res) {
    try {
        const { credential, accessToken } = req.body;

        if (!credential && !accessToken) {
            return res.status(400).json({
                message: "Google credential or access token is required."
            });
        }

        let email, name, picture, googleId;

        if (credential) {
            const googleClientId = process.env.GOOGLE_CLIENT_ID;
            if (!googleClientId) {
                return res.status(500).json({
                    message: "GOOGLE_CLIENT_ID is not configured in backend environment variables."
                });
            }

            const googleClient = new OAuth2Client(googleClientId);
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: googleClientId
            });
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                return res.status(400).json({
                    message: "Invalid Google token payload."
                });
            }

            email = payload.email.toLowerCase().trim();
            name = payload.name;
            picture = payload.picture;
            googleId = payload.sub;
        } else if (accessToken) {
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!userInfoRes.ok) {
                return res.status(400).json({
                    message: "Failed to verify Google access token."
                });
            }

            const payload = await userInfoRes.json();
            if (!payload || !payload.email) {
                return res.status(400).json({
                    message: "Google account does not contain a verified email."
                });
            }

            email = payload.email.toLowerCase().trim();
            name = payload.name;
            picture = payload.picture;
            googleId = payload.sub;
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });

        if (!user) {
            // Generate clean unique username
            let baseName = (name || email.split("@")[0])
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 16);
            if (!baseName) baseName = "candidate";

            let username = baseName;
            let counter = 1;
            while (await userModel.findOne({ username })) {
                username = `${baseName}${counter}`;
                counter++;
            }

            // Create user with random secure hash for password field requirement
            const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await userModel.create({
                username,
                email,
                password: hashedPassword,
                googleId,
                avatar: picture || "",
                authProvider: "google"
            });
        } else {
            // Existing user: link googleId and avatar if not present
            let modified = false;
            if (!user.googleId && googleId) {
                user.googleId = googleId;
                modified = true;
            }
            if (!user.avatar && picture) {
                user.avatar = picture;
                modified = true;
            }
            if (modified) {
                await user.save();
            }
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Google authentication successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || ""
            }
        });
    } catch (err) {
        console.error("Error in googleAuthController:", err);
        return res.status(400).json({
            message: err.message || "Failed to authenticate with Google."
        });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleAuthController
}
