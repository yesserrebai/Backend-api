import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import Posts from "../models/post/postModel";
import Comments from "../models/comments/commentModel";

interface CommentRequestBody {
    postId: string;
    content: string;
    tag?: string[];
    reply?: string;
    postUserId: string;
}

interface UpdateCommentRequestBody {
    content: string;
}

interface LikeCommentRequestBody {
    id: string;
}

export const createComment = async (req: JwtPayload, res: Response) => {
    try {
        const { postId, content, tag, reply, postUserId } =
            req.body as CommentRequestBody;

        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(400).json({ msg: "Post does not exist." });
        }

        if (reply) {
            const cm = await Comments.findById(reply);
            if (!cm) {
                return res.status(400).json({ msg: "Comment does not exist." });
            }
        }

        const newComment = new Comments({
            user: req.user._id,
            content,
            tag,
            reply,
            postUserId,
            postId,
        });

        await Posts.findOneAndUpdate(
            { _id: postId },
            {
                $push: { comments: newComment._id },
            },
            { new: true }
        );

        await newComment.save();
        res.json({ newComment });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const updateComment = async (req: JwtPayload, res: Response) => {
    try {
        const { content } = req.body as UpdateCommentRequestBody;

        await Comments.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { content }
        );

        res.json({ msg: "updated successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const likeComment = async (req: JwtPayload, res: Response) => {
    try {
        const { id } = req.params as LikeCommentRequestBody;

        const comment = await Comments.find({
            _id: id,
            likes: req.user._id,
        });
        if (comment.length > 0) {
            return res
                .status(400)
                .json({ msg: "You have already liked this post" });
        }

        await Comments.findOneAndUpdate(
            { _id: id },
            {
                $push: { likes: req.user._id },
            },
            {
                new: true,
            }
        );

        res.json({ msg: "Comment liked successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const unLikeComment = async (req: JwtPayload, res: Response) => {
    try {
        const { id } = req.params as LikeCommentRequestBody;

        await Comments.findOneAndUpdate(
            { _id: id },
            {
                $pull: { likes: req.user._id },
            },
            {
                new: true,
            }
        );

        res.json({ msg: "Comment unliked successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const deleteComment = async (req: JwtPayload, res: Response) => {
    try {
        const comment = await Comments.findOneAndDelete({
            _id: req.params.id,
            $or: [{ user: req.user._id }, { postUserId: req.user._id }],
        });

        await Posts.findOneAndUpdate(
            {
                _id:
                    req.params.id
            },
            { $pull: { comments: req.params.id } }
        );


        res.json({ msg: "Comment deleted successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};





