import mongoose from 'mongoose';

const blogActivitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blog',
    },
    blogTitle: { type: String, required: true, trim: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted'],
      required: true,
    },
    status: { type: String, enum: ['draft', 'published'] },
  },
  { timestamps: true }
);

blogActivitySchema.index({ actor: 1, createdAt: -1 });

const BlogActivity = mongoose.model('BlogActivity', blogActivitySchema, 'blog_activities');
export default BlogActivity;
