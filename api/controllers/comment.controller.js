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

export const getPostComments = async (req, res, next) => {
    try{
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    }catch(error){
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) return next(errorHanlder(404, "Comment not found"));
        if(!comment.likes.includes(req.user.id)){
            comment.numberOfLikes+=1;
            comment.likes.push(req.user.id);
            const updatedComment = await comment.save();
            res.status(200).json(updatedComment);
        }else{
            comment.numberOfLikes-=1;
            comment.likes = comment.likes.filter((id) => id !== req.user.id);
            const updatedComment = await comment.save();
            res.status(200).json(updatedComment);
        }
    }catch(error){
        next(error);
    }
}
