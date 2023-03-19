import * as jwt from "jsonwebtoken"

export const createAccessToken = (id:string) =>{
    return jwt.sign({id},process.env.SECRETKEY,
        {expiresIn : process.env.JWTEXPIRES_IN});
};


