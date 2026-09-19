import { handleError } from '../Helper/handleError.js';
import Likes from '../models/LikeModel.js';
import Blog from '../models/BlogModel.js';
import { z } from 'zod';

const likeSchema = z.object({ blogid: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid blog.') });

export const like = async (req, res, next) => {
  try {
    const result = likeSchema.safeParse(req.body);
    if (!result.success) return next(handleError(400, result.error.issues[0].message));
    const blog = await Blog.findById(result.data.blogid).select('_id status publishedAt');
    if (!blog || blog.status === 'draft' || (blog.publishedAt && blog.publishedAt > new Date())) return next(handleError(404, 'Published blog not found.'));
    const existingLike = await Likes.findOne({ userid: req.user._id, blogid: blog._id });
    if (existingLike) await existingLike.deleteOne();
    else await Likes.create({ userid: req.user._id, blogid: blog._id });
    const countLike = await Likes.countDocuments({ blogid: blog._id });
    res.status(200).json({ success: true, countLike, isLikedByUser: !existingLike });
  } catch (error) {
    if (error?.code === 11000) return next(handleError(409, 'Like state changed; please retry.'));
    next(handleError(500, error.message));
  }
};

export const likeCount = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const countLike = await Likes.countDocuments({ blogid });
    const isLikedByUser = req.user ? Boolean(await Likes.exists({ blogid, userid: req.user._id })) : false;
    res.status(200).json({ countLike, isLikedByUser });
  } catch (error) {
    next(handleError(400, 'Invalid blog identifier.'));
  }
};
