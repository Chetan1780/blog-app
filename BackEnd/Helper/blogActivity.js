import BlogActivity from '../models/BlogActivityModel.js';

export const recordBlogActivity = async ({ actor, blog, action }) => {
  try {
    await BlogActivity.create({
      actor,
      blog: blog._id,
      blogTitle: blog.title,
      action,
      status: blog.status,
    });
  } catch (error) {
    // Activity history must not prevent a user from saving their work.
    console.error('Unable to record blog activity:', error.message);
  }
};
