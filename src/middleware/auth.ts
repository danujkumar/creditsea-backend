const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/user"); // Import User model
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Use environment variable

// Middleware to protect routes based on cookie authentication
const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized, invalid token" });
    }
});

// Middleware to protect routes based on Authorization header
const safety = asyncHandler(async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not accessible, token missing" });
        }

        const jwtToken = token.replace("Bearer ", "").trim();
        const isVerified = jwt.verify(jwtToken, JWT_SECRET);
        
        const userData = await User.findById(isVerified.userId).select("-password");
        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = userData;
        req.token = jwtToken;
        req.userID = userData._id;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
});

module.exports = { protect, safety };
