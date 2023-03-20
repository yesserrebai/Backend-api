import User from "../models/user/userModel"
import * as jwt from "jsonwebtoken";

export const isloggedin = async (req:any,res:any,next:any) => {
    try {
        const token = req.header("Authorization");

        if(!token){
            return res.status(400).json({ msg: "You are not authorized" });
        }

        const decoded = jwt.verify(token, process.env.SECRETKEY);

        if (!decoded) {
          return res.status(400).json({ msg: "You are not authorized" });
        }

        const user = await User.findOne({_id: decoded.id});

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}


