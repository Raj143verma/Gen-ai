const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        sparse: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;