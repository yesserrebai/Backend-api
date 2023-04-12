import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import Users from "../models/user/userModel";
import { CustomRequest } from "../utils/interfaces";
const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ msg: "You are not authorized" });
    }

    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(400).json({ msg: "You are not authorized" });
    }

    const user = await Users.findOne({ _id: decoded.payload.id });
    req.user = user;
    next();
    // rather than binding the whole document we should bind _id or email only
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

export default auth;
