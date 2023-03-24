import User from "../models/user/userModel"
import * as jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { createAccessToken,resetPassword ,requestPasswordReset } from "./services"

interface ID {
    id:string,
    user:any,
    statusCode: number,
    res:any,
    req:any,
    email:string,
    password: string,
}



export const register = async(req:any,res:any)=>{
    try {
        const {
            email,
            password,
            user,
            firstname,
            lastname,
            gender,
            usertype,
            country,
            city,
            postalcode,
            language,
            dateofbirth,
         } = req.body
       

        //Check to see if email exist in the databse
        const user_email = await User.findOne({email})
        if(user_email) {
            return res.status(400).json({message: "The email is already registerd"})
        }
        
        const registerUser = await User.create(req.body)
        const access_token = createAccessToken({id:registerUser._id})

        res.status(200).json({
        status: "success",
        message: "Registration Successfully",
        access_token,
        user:{
            ...registerUser._doc,
            password:""
        }
    })

        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
             status: "unknown"
             message: err.message 
             });
    }

}

export const login = async(req:any,res:any)=>{
    try {
    
    const { email,password } = req.body;
    const user = await User.findOne({email, usertype:"user"}).select('+password');

    if(!email || !password){
        return res.status(400).json({
            status: "error",
            message: "Username and password can not be blank"
            })
    }

    if(!user){
        return res.status(400).json({
            status: "error",
            message: "Email or Password is incorrect"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
            status: "error",
            message: "Email or Password is incorrect"
        })
    }

    const access_token = createAccessToken({id:user._id})

    res.status(200).json({
        status: "success",
        message: "You have been logged in!",
        access_token,
        user:{
            ...user._doc,
            password:""
        }
    })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: "unknown",
            message: err.message
        })
    }
    
}

export const adminlogin = async(req:any,res:any)=>{
     try {
    const { email,password } = req.body;
    const user = await User.findOne({email, usertype:"admin"}).select('+password');

    if(!email || !password){
        return res.status(400).json({
            status: "error",
            message: "Username and password can not be blank"
            })
    }

    if(!user){
        return res.status(400).json({
            status: "error",
            message: "Email or Password is incorrect"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
            status: "error",
            message: "Email or Password is incorrect"
        })
    }

    const access_token = createAccessToken({id:user._id})

    res.status(200).json({
        status: "success",
        message: "You have been logged in as an Admin!",
        ip: ip,
        access_token,
        user:{
            ...user._doc,
            password:""
        }
    })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: "unknown",
            message: err.message
        })
    }
}

export const resetPasswordRequestController = async (req:any, res:any) => {
    const requestPasswordResetService = await requestPasswordReset(
      req.body.email
    );
    return res.json(requestPasswordResetService);
  }

export const resetPasswordController = async (req:any, res:any)=> {
    const resetPasswordService = await resetPassword(
      req.body.userId,
      req.body.token,
      req.body.password
    );
    return res.json(resetPasswordService);
};