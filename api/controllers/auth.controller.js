import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHanlder } from "../utils/error.js";
import jwt from 'jsonwebtoken';
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHanlder(400, 'All fields are required'))
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        res.json('Signup successful')
    } catch (error) {
        // res.status(500).json({message:error.message})
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHanlder(400, 'All fields are required'))
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHanlder(400, 'User not found'))
        }
        const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return next(errorHanlder(400, 'Incorrect password'))
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = user._doc;

        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest)
    } catch (error) {
        // res.status(500).json({message:error.message})
        next(error);
    }
}

export const google = async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(user);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
        }
    } catch (error) {
        next(error);
    }
}