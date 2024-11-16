import jwt from "jsonwebtoken";
import { errorHanlder } from "./error.js";
export const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token){
        return next(errorHanlder(401,"You are not Unauthorized"));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHanlder(403,"Token is not valid"));
        }
        req.user=user;
        next();
    })
}