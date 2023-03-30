import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import Post, {IPost} from "../models/post/postModel";
import Comment from "../models/comments/commentModel";
import User from "../models/user/userModel";
import { Query, Document, Model } from 'mongoose';

class APIfeatures {
  query: Query<Document[], Document>;

  queryString: any;

  constructor(query: Query<Document[], Document>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export const createPost = async (req: JwtPayload, res: Response) => {
    try {
        const { content, images } = req.body;

        if (images.length === 0) {
            return res.status(400).json({ msg: "Please add photo(s)" });
        }

        const newPost = new Post({
            content,
            images,
            user: req.user._id,
        });
        await newPost.save();

        res.json({
            msg: "Post created successfully.",
            newPost: {
                ...newPost,
                user: req.user,
            },
        });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const getPosts = async (req: JwtPayload, res: Response) => {
    try {
        const features = new APIfeatures(
            Post.find({
                user: [...req.user.following, req.user._id],
            }),
            req.query
        ).paginating();
        const posts = await features.query
            .sort("-createdAt")
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes ",
                    select: "-password",
                },
            });

        res.json({
            msg: "Success",
            result: posts.length,
            posts,
        });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { content, images } = req.body;

        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                content,
                images,
            }
        )
            .populate("user likes", "avatar username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes ",
                    select: "-password",
                },
            });

        res.json({
            msg: "Post updated successfully.",
            newPost: {
                ...post,
                content,
                images,
            },
        });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const likePost = async (req: JwtPayload, res: Response) => {
    try {
        const post = await Post.find({
            _id: req.params.id,
            likes: req.user._id,
        });
        if (post.length > 0) {
            return res
                .status(400)
                .json({ msg: "You have already liked this post" });
        }

        const like = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: { likes: req.user._id },
            },
            {
                new: true,
            }
        );

        if (!like) {
            return res.status(400).json({ msg: "Post does not exist." });
        }

        res.json({ msg: "Post liked successfully." });
    } catch (err: any) {
        return res.status(500).json({ msg: err.message });
    }
};


export const unLikePost = async (req: JwtPayload, res: Response) => {
    try {
        const like = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                $pull: { likes: req.user._id },
            },
            {
                new: true,
            }
        );

        if (!like) {
            return res.status(400).json({ msg: "Post does not exist." });
        }

        res.json({ msg: "Post unliked successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const features = new APIfeatures(
            Post.find({ user: req.params.id }),
            req.query
        ).paginating();
        const posts = await features.query.sort("-createdAt");

        res.json({
            posts,
            result: posts.length,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const getPost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes ",
                    select: "-password",
                },
            });

        if (!post) {
            return res.status(400).json({ msg: "Post does not exist." });
        }

        res.json({ post });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const getPostDiscover = async (req: JwtPayload, res: Response) => {
    try {
        const newArr = [...req.user.following, req.user._id];

        const num = req.query.num || 8;

        const posts = await Post.aggregate([
            { $match: { user: { $nin: newArr } } },
            { $sample: { size: Number(num) } },
        ]);

        res.json({
            msg: "Success",
            result: posts.length,
            posts,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const deletePost = async (req: JwtPayload, res: Response) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        await Comment.deleteMany({ _id: { $in: post.comments } });

        res.json({
            msg: "Post deleted successfully.",
            newPost: {
                ...post,
                user: req.user
            }
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const reportPost = async (req: JwtPayload, res: Response): Promise<Response> => {
    try {
        const post = await Post.find({
            _id: req.params.id,
            reports: req.user._id,
        });
        if (post.length > 0) {
            return res
                .status(400)
                .json({ msg: "You have already reported this post" });
        }

        const report = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: { reports: req.user._id },
            },
            {
                new: true,
            }
        );

        if (!report) {
            return res.status(400).json({ msg: "Post does not exist." });
        }

        return res.json({ msg: "Post reported successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const savePost = async (req: JwtPayload, res: Response): Promise<Response> => {
    try {
        const user = await User.find({
            _id: req.user._id,
            saved: req.params.id,
        });
        if (user.length > 0) {
            return res
                .status(400)
                .json({ msg: "You have already saved this post." });
        }

        const save = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $push: { saved: req.params.id },
            },
            {
                new: true,
            }
        );

        if (!save) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        return res.json({ msg: "Post saved successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const unSavePost = async (req: JwtPayload, res: Response): Promise<Response> => {
    try {
        const save = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $pull: { saved: req.params.id },
            },
            {
                new: true,
            }
        );

        if (!save) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        return res.json({ msg: "Post removed from collection successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const getSavePost = async (req: JwtPayload, res: Response): Promise<Response> => {
    try {
        const features = new APIfeatures(Post.find({ _id: { $in: req.user.saved } }), req.query).paginating();

        const savePosts = await features.query.sort("-createdAt");

        return res.json({
            savePosts,
            result: savePosts.length
        })

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}
