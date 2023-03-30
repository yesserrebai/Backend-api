import jwt,{JwtPayload} from "jsonwebtoken";
import { APP_SECRET } from "../config/index";
import { UserPayload } from "../typings";
import bcrypt from "bcrypt"


export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

export const Generatesignature = async (payload: UserPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
  };
  

export const verifySignature = async (signature: string) => {
    return jwt.verify(signature, APP_SECRET) as JwtPayload
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async( enteredPassword:string,savedPassword:string, salt:string)=>{
    return await GeneratePassword(enteredPassword, salt) === savedPassword
  }