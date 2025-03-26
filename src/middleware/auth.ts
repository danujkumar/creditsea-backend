import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Import User model
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret"; // Use environment variable

// Extend Request type to include user, token, and userID
interface AuthRequest extends Request {
    user?: any; // Use appropriate type for your User model
    token?: string;
    userID?: string;
}

// Middleware to protect routes based on cookie authentication
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (decoded && typeof decoded === "object" && "userId" in decoded) {
            req.user = await User.findById(decoded.userId).select("-password");
        } else {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized, invalid token" });
        return;
    }
});

// Middleware to protect routes based on Authorization header
export const safety = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            res.status(401).json({ message: "Not accessible, token missing" });
            return;
        }

        const jwtToken = token.replace("Bearer ", "").trim();
        const isVerified = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;

        const userData = await User.findById(isVerified.userId).select("-password");
        if (!userData) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        req.user = userData;
        req.token = jwtToken;
        req.userID = userData._id.toString();

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized, invalid token" });
        return;
    }
});
