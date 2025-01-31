import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token  = req.headers.token;

  jwt.verify(token as string, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token provided/ No authorization" });
    }
    //@ts-ignore
    req.userId = decoded.id;
    next()
  });
};
