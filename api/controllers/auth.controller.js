import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHanlder } from "../utils/error.js";
export const signup=async(req,res,next)=>{
   const {username,email,password}=req.body;
   if(!username || !email || !password || username==='' || email==='' || password===''){
    next(errorHanlder(400,'All fields are required'))
   }
   const hashedPassword= bcryptjs.hashSync(password,10);
   const user=new User({username,email,password:hashedPassword});

   try{
    await user.save();
    res.json('Signup successful')
   }catch(error){
    // res.status(500).json({message:error.message})
    next(error);
   }
}