import * as jwt from "jsonwebtoken"
import User from './../models/user/userModel'
import Token from './../models/token/tokenModel'
import bcrypt from "bcrypt"
import crypto from "crypto"
import {sendEmailResetPassword,sendEmailSuccessResetPassword} from "../utils/email/sendEmail"

export const createAccessToken = (id:string) =>{
    return jwt.sign({id},process.env.SECRETKEY,
        {expiresIn : process.env.JWTEXPIRES_IN});
};


export const requestPasswordReset = async (email:String) => {

    const user = await User.findOne({ email });
  
    if (!user) throw new Error("User does not exist");
    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(12));
  
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();
  
    const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendEmailResetPassword(user.email,"Password Reset Request",user.firstname+' '+user.lastname,link);
    return link;
}

export const resetPassword = async (userId:String, token:Buffer, password:Buffer) => {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, Number(12));
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    sendEmailSuccessResetPassword(
      user.email,
      "Password Reset Successfully",
      user.firstname+' '+user.lastname
    );
    await passwordResetToken.deleteOne();
    return true;
  };