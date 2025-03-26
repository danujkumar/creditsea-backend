import jwt from "jsonwebtoken";
import { Response } from "express"; 

const generateToken = (res: Response, userId: any): string => {
  const secretKey = process.env.JWT_SECRET || "abc123";

  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  console.log(token);
  return token;
};

export default generateToken;
