import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        // Check if user is authorized
        if (userId !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to create a comment" });
        }

        // Create and save the comment
        const newComment = new Comment({ content, postId, userId });
        const savedComment = await newComment.save();

        // Send the response
        res.status(201).json({ savedComment });
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};
