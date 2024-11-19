import { parse } from "dotenv";
import Post from "../models/post.model.js";
import { errorHanlder } from "../utils/error.js";

export const create = async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(errorHanlder(403, "You are not allow to create post"));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHanlder(400, "All fields are required"));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    })
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

// export const getposts = async (req, res, next) => {
//     try {
//         const startIndex = parseInt(req.query.startIndex) || 0;
//         const limit = parseInt(req.query.limit) || 9;
//         const sortDirection = req.query.order === "asc" ? 1 : -1;
//         const posts = await Post.find(
//             ...(req.query.userId && { userId: req.query.userId }),
//             ...(req.query.category && { category: req.query.category }),
//             ...(req.query.slug && { category: req.query.slug }),
//             ...(req.query.postId && { _id: req.query.postId }),
//             ...(req.query.search && {
//                 $or:[
//                     { title: { $regex: req.query.searchTerm, $options: "i" } },
//                     { content: { $regex: req.query.searchTerm, $options: "i" } }
//                 ]
//             })
//         ).sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
       
//         const totalPosts = await Post.countDocuments();
//         const oneMonthAgo=new Date(
//             now.getFullYear(),
//             now.getMonth() - 1,
//             now.getDate()
//         )

//         const lastMonthAgo=await Post.countDocuments({
//             createdAt: {
//                 $gte: oneMonthAgo
//             }
//         })

//         res.status(200).json({
//             posts,
//             totalPosts,
//             lastMonthAgo
//         });

//     } catch (error) {
//         next(error);
//     }
// }


export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        // Construct the query filter
        const filter = {};
        if (req.query.userId) filter.userId = req.query.userId;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.slug) filter.slug = req.query.slug;
        if (req.query.postId) filter._id = req.query.postId;
        if (req.query.searchTerm) {
            filter.$or = [
                { title: { $regex: req.query.searchTerm, $options: "i" } },
                { content: { $regex: req.query.searchTerm, $options: "i" } }
            ];
        }

        // Fetch posts based on filter
        const posts = await Post.find(filter)
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        // Get the total number of posts
        const totalPosts = await Post.countDocuments();

        // Calculate the posts created within the last month
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthAgo = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        // Send the response
        res.status(200).json({
            posts,
            totalPosts,
            lastMonthAgo
        });

    } catch (error) {
        next(error);
    }
};

export const deletepost = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHanlder(403,"You are not allow to delete post"));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post has been deleted");
    } catch (error) {
        next(error);
    }
}