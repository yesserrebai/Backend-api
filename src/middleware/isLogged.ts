import {Request, Response, NextFunction} from 'express'
import User from "../models/user/userModel"
import jwt, {JwtPayload} from "jsonwebtoken";


export const auth = async(req:JwtPayload , res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
    
        if(!authorization){
            return res.status(401).json({
                Error:"Kindly login"
            })
        }
       // Bearer erryyyygccffxfx
       const token = authorization.slice(7, authorization.length);
        let verified = jwt.verify(token, process.env.SECRETKEY);
    
        if(!verified){
            return res.status(401).json({
                Error:"unauthorised"
            })
        }
       
      
        const {id} = verified as {[key:string]:string}
    
         // find the user by id
         const user = (await User.findOne({
            where: { id: id},
          }))
    
         if(!user){
            return res.status(401).json({
                Error:"Invalid Credentials"
            })
         } 
    
       req.user = verified;
       next()
    }catch(err){
        return res.status(401).json({
            Error:"unauthorised"
        })
    }
    }




