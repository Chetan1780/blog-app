import Category from '../models/CategoryModel.js';
import cloudinary from '../Config/cloudinary.js';
import { handleError } from '../Helper/handleError.js';
import Blog from '../models/BlogModel.js';
import BlogActivity from '../models/BlogActivityModel.js';
import { recordBlogActivity } from '../Helper/blogActivity.js';
import { encode } from 'entities';
import { sanitizeRichText } from '../Helper/sanitizeRichText.js';
import { z } from 'zod';

const blogSchema = z.object({
    category: z.string().regex(/^[a-f\d]{24}$/i, 'Choose a valid category.'),
    slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
    title: z.string().trim().min(3).max(180),
    content: z.string().min(3).max(200_000),
    excerpt: z.string().trim().max(320).optional().or(z.literal('')),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.enum(['draft', 'published']).default('draft'),
    publishedAt: z.string().datetime().optional().or(z.literal('')),
    featuredImageAlt: z.string().trim().max(180).optional().or(z.literal('')),
});

const publicBlogFilter = () => ({
    $and: [
        { $or: [{ status: 'published' }, { status: { $exists: false } }] },
        { $or: [{ publishedAt: { $lte: new Date() } }, { publishedAt: { $exists: false } }] }
    ]
});

const normaliseTags = (tags) => {
    const source = Array.isArray(tags) ? tags : String(tags || '').split(',');
    return [...new Set(source
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean))].slice(0, 8);
};

const calculateReadingTime = (content) => {
    const words = String(content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-zA-Z0-9#]+;/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
};

const getPublicationFields = (data) => {
    const status = data.status === 'published' ? 'published' : 'draft';
    const publishedAt = status === 'published'
        ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
        : undefined;

    return { status, publishedAt };
};

const canManageBlog = (user, blog) => user.role === 'admin' || String(blog.author) === String(user._id);
const makeCursor = (blog) => Buffer.from(JSON.stringify({ createdAt: blog.createdAt, id: blog._id })).toString('base64url');
const parseCursor = (value) => { try { return value ? JSON.parse(Buffer.from(value, 'base64url').toString()) : null; } catch { return null; } };

export const addBlog = async (req, res, next) => {
    try {
        const data = blogSchema.parse(JSON.parse(req.body.data || '{}'));
        if (!req.file) {
            return next(handleError(400, 'A featured image is required.'));
        }
        let temp;
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog-images',
            resource_type: 'auto'
        });
        temp = uploadResult.secure_url;
        const publication = getPublicationFields(data);
        const blog = new Blog({
            author: req.user._id,
            category: data.category,
            slug:data.slug,
            title: data.title,
            featuredImage: temp,
            featuredImageAlt: data.featuredImageAlt || data.title,
            excerpt: data.excerpt,
            tags: normaliseTags(data.tags),
            readingTime: calculateReadingTime(data.content),
            ...publication,
            content: encode(sanitizeRichText(data.content))
        });
        await blog.save();
        await recordBlogActivity({ actor: req.user._id, blog, action: 'created' });
        res.status(201).json({ success: true, blog, message: "Blog saved successfully." });
    } catch (error) {
        next(handleError(error instanceof z.ZodError || error instanceof SyntaxError ? 400 : 500, error instanceof z.ZodError ? error.issues[0].message : error.message));
    }
};

export const allBlog = async (req,res,next)=>{
    try {
        let blog;
        // console.log(req.user);
        if(req.user && req.user.role==='admin'){
            blog = await Blog.find().populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        } else if(req.user){
            blog = await Blog.find({author: req.user._id}).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        } else{
            blog = await Blog.find(publicBlogFilter()).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        }
        res.status(200).json({
            blog,
            stats: {
                total: blog.length,
                drafts: blog.filter((item) => item.status === 'draft').length,
                scheduled: blog.filter((item) => item.status === 'published' && item.publishedAt && new Date(item.publishedAt) > new Date()).length,
                published: blog.filter((item) => item.status !== 'draft' && (!item.publishedAt || new Date(item.publishedAt) <= new Date())).length,
                views: blog.reduce((total, item) => total + (item.viewCount || 0), 0)
            }
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}

export const getPublicFeed = async (req, res, next) => {
    try {
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 30);
        const cursor = parseCursor(req.query.cursor);
        const filter = publicBlogFilter();
        const category = String(req.query.category || '').trim();
        if (category) {
            const categoryData = await Category.findOne({ slug: category }).select('_id');
            if (!categoryData) return res.status(200).json({ items: [], nextCursor: null, hasNextPage: false });
            filter.$and.push({ category: categoryData._id });
        }
        if (cursor?.createdAt && cursor?.id) filter.$and.push({ $or: [{ createdAt: { $lt: new Date(cursor.createdAt) } }, { createdAt: new Date(cursor.createdAt), _id: { $lt: cursor.id } }] });
        const docs = await Blog.find(filter).select('author category title slug excerpt tags readingTime featuredImage featuredImageAlt createdAt').populate('author','name avatar role').populate('category','name slug').sort({ createdAt: -1, _id: -1 }).limit(limit + 1).lean();
        const hasNextPage = docs.length > limit;
        const items = hasNextPage ? docs.slice(0, limit) : docs;
        res.status(200).json({ items, hasNextPage, nextCursor: hasNextPage ? makeCursor(items.at(-1)) : null });
    } catch (error) { next(handleError(500, error.message)); }
};

export const deleteBlog = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        const blog = await Blog.findById(blogid);
        if (!blog) return next(handleError(404, 'Blog not found.'));
        if (!canManageBlog(req.user, blog)) return next(handleError(403, 'You cannot delete this blog.'));
        await recordBlogActivity({ actor: req.user._id, blog, action: 'deleted' });
        await blog.deleteOne();
        res.status(200).json({
            success:true,
            message:"Blog Deleted SuccessFully!!"
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const editBlog = async (req,res,next)=>{
    try {
        const data = blogSchema.parse(JSON.parse(req.body.data || '{}'));
        // console
        const blog = Blog.findById(data._id)
        if(req.file){

        }
        
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const showBlog = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        const blog = await Blog.findById(blogid);
        if(!blog) return next(handleError(404,"Data not found!!"));
        if (!canManageBlog(req.user, blog)) return next(handleError(403, 'You cannot view this draft.'));
        res.status(200).json({ blog });
    } catch (error) {
        next(handleError(500, error.message));
    }
}
export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params;
        const data = JSON.parse(req.body.data);
        const blog = await Blog.findById(blogid);
        if (!blog) return next(handleError(404, 'Blog not found.'));
        if (!canManageBlog(req.user, blog)) return next(handleError(403, 'You cannot update this blog.'));
        
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog-images',
                resource_type: 'auto'
            });
            blog.featuredImage = uploadResult.secure_url;
        }
        
        blog.category = data.category;
        blog.title = data.title;
        blog.slug = data.slug;
        blog.featuredImageAlt = data.featuredImageAlt || data.title;
        blog.excerpt = data.excerpt;
        blog.tags = normaliseTags(data.tags);
        blog.readingTime = calculateReadingTime(data.content);
        Object.assign(blog, getPublicationFields(data));
        blog.content = encode(sanitizeRichText(data.content));
        
        // Regenerate summary
        // blog.summary = (await summarize(data.content, "summarize")).join(" ");
        
        await blog.save();
        await recordBlogActivity({ actor: req.user._id, blog, action: 'updated' });
        res.status(200).json({ success: true, blog, message: "Blog updated successfully." });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

// export const regenerateSummary = async (req, res, next) => {
//     try {
//         const { blogid } = req.params;
//         const blog = await Blog.findById(blogid);
//         if (!blog) return next(handleError(404, "Blog not found"));
        
//         blog.summary = (await summarize(blog.content, "summarize")).join(" ");
//         await blog.save();
        
//         res.status(200).json({ success: true, summary: blog.summary });
//     } catch (error) {
//         next(handleError(500, error.message));
//     }
// };

export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ $and: [publicBlogFilter(), { slug }] }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec();
        if (!blog) return next(handleError(404, 'Published blog not found.'));
        res.status(200).json({ blog });
    } catch (error) {
        next(handleError(500, error.message));
    }
};
export const getRelatedBlog = async (req,res,next)=>{
    try {
        const {category,currBlog} = req.params;
        const categoryData = await Category.findOne({slug:category})
        if(!categoryData){
            return next(handleError(404,'Category data not found!!'))
        }
        const blog = await Blog.find({ $and: [publicBlogFilter(), { category:categoryData._id, slug:{$ne:currBlog} }] }).limit(4).lean().exec();
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const getBlogBycategory = async (req,res,next)=>{
    try {
        const {category} = req.params;
        const categoryData = await Category.findOne({slug:category})
        if(!categoryData){
            return next(handleError(404,'Category data not found!!'))
        }
        const blog = await Blog.find({ $and: [publicBlogFilter(), { category:categoryData._id }] }).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const search = async (req,res,next)=>{
    try {
        const query = String(req.query.q || '').trim().slice(0, 80);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blog = await Blog.find({ $and: [publicBlogFilter(), { title:{$regex:escapedQuery,$options:'i'} }] }).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).limit(30).lean().exec();
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}

export const recordView = async (req, res, next) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { $and: [publicBlogFilter(), { slug: req.params.slug }] },
            { $inc: { viewCount: 1 } },
            { new: true, projection: { viewCount: 1 } }
        );
        if (!blog) return next(handleError(404, 'Published blog not found.'));
        res.status(200).json({ viewCount: blog.viewCount });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const getRecentActivity = async (req, res, next) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { actor: req.user._id };
        const activity = await BlogActivity.find(filter)
            .populate('actor', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(6)
            .lean()
            .exec();
        res.status(200).json({ activity });
    } catch (error) {
        next(handleError(500, error.message));
    }
};
