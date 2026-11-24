const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/*
*@route POST /api/auth/register
*@desc Register a new user
*@access Public
*/
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */

authRouter.post("/login", authController.loginUserController);

/**
 * @route POST /api/auth/google
 * @desc Authenticate or register a user with Google OAuth (ID token or access token)
 * @access Public
 */
authRouter.post("/google", authController.googleAuthController);


/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */

authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the logged in user, expect token in the cookie
 * @access Private
 */
 authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter