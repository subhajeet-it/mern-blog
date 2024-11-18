import bcryptjs from "bcryptjs";
import { errorHanlder } from "../utils/error.js";
import User from "../models/user.model.js";
export const test = (req, res) => {
    res.json({ message: "hello world" })
}

export const updateUser = async (req, res, next) => {

    if (req.user.id !== req.params.userId) {
        return next(errorHanlder(403, "You are not allow update the user"));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHanlder(400, "Password must be at least 6 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHanlder(400, "Username must be at least 7 characters and less than 20 characters"));
        }
        if (req.body.username.includes(" ")) {
            return next(errorHanlder(400, "Username cannot contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHanlder(400, "Username must be lowecase"));
        }
        // if (req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        //     return next(errorHanlder(400, "Username can contain only letters and numbers"));
        // }
        try {
            const userUpdate = await User.findOneAndUpdate( { _id: req.params.userId }, { $set: { username: req.body.username, email: req.body.email, profilePicture: req.body.profilePicture, password: req.body.password } },{new: true});
            const { password, ...rest } = userUpdate._doc;
            res.status(200).json(rest);
        }catch(error){
            next(error);
        }
            
    }

}


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHanlder(403, "You are not allow delete the user"));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}