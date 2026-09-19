import { handleError } from '../Helper/handleError.js';
import Comment from '../models/CommentModel.js';
import Blog from '../models/BlogModel.js';
import { z } from 'zod';

const commentSchema = z.object({
  blogid: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid blog.'),
  comment: z.string().trim().min(1).max(1_000),
});

export const addComment = async (req, res, next) => {
  try {
    const result = commentSchema.safeParse(req.body);
    if (!result.success) return next(handleError(400, result.error.issues[0].message));
    const blog = await Blog.findById(result.data.blogid).select('_id status publishedAt');
    if (!blog || blog.status === 'draft' || (blog.publishedAt && blog.publishedAt > new Date())) return next(handleError(404, 'Published blog not found.'));
    const comment = await Comment.create({ user: req.user._id, blogid: blog._id, comment: result.data.comment });
    res.status(201).json({ success: true, message: 'Comment submitted.', comment });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blogid: req.params.blogid }).populate('user', 'name avatar').sort({ createdAt: -1 }).limit(100).lean();
    res.status(200).json({ comments });
  } catch (error) {
    next(handleError(400, 'Invalid blog identifier.'));
  }
};

export const commentCount = async (req, res, next) => {
  try {
    const count = await Comment.countDocuments({ blogid: req.params.blogid });
    res.status(200).json({ count });
  } catch (error) {
    next(handleError(400, 'Invalid blog identifier.'));
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const authoredBlogs = req.user.role === 'admin' ? [] : await Blog.find({ author: req.user._id }).distinct('_id');
    const filter = req.user.role === 'admin' ? {} : { blogid: { $in: authoredBlogs } };
    const comments = await Comment.find(filter).populate('blogid', 'title slug category').populate('user', 'name').sort({ createdAt: -1 }).limit(200).lean();
    res.status(200).json({ comments });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commendId);
    if (!comment) return next(handleError(404, 'Comment not found.'));
    const blog = await Blog.findById(comment.blogid).select('author');
    const canDelete = req.user.role === 'admin' || String(comment.user) === String(req.user._id) || String(blog?.author) === String(req.user._id);
    if (!canDelete) return next(handleError(403, 'You cannot delete this comment.'));
    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted.' });
  } catch (error) {
    next(handleError(400, 'Invalid comment identifier.'));
  }
};
