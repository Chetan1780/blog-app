import { motion } from 'framer-motion';
import Comment from '@/components/Comment';
import CommentCount from '@/components/CommentCount';
import CommentList from '@/components/CommentList';
import LikeCount from '@/components/LikeCount';
import RelatedBlog from '@/components/RelatedBlog';
import { Avatar } from '@/components/ui/avatar';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import { AvatarImage } from '@radix-ui/react-avatar';
import { decode } from 'entities';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import { FiClock, FiEye } from 'react-icons/fi';
import DOMPurify from 'dompurify';

const BlogDetails = () => {
    const { blog, category } = useParams();
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/getblog/${blog}`, {
        method: 'get', credentials: 'include'
    }, [blog, category]);

    const [refresh, setreFresh] = useState();

    // console.log(data);

    useEffect(() => {
        if (!data?.blog?._id || !blog) return;
        const viewKey = `view-recorded:${blog}`;
        if (sessionStorage.getItem(viewKey)) return;
        sessionStorage.setItem(viewKey, 'true');

        fetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/view/${blog}`, { method: 'POST' }).catch(() => {
            sessionStorage.removeItem(viewKey);
        });
    }, [blog, data?.blog?._id]);

    if (loading) return <Loading />;
    if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">This story could not be loaded.</div>;
    const sanitizedContent = data?.blog?.content
    ? decode(data.blog.content)
        .replace(/style="[^"]*"/g, '') // Remove inline styles
        .replace(/>\s+</g, '><') // Remove excessive spaces between tags
        .replace(/\s{2,}/g, ' ') // Remove multiple spaces
        .trim() // Trim extra whitespace
    : '';
    const safeContent = DOMPurify.sanitize(sanitizedContent, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'],
    });


    return (
        <div className="flex flex-col md:flex-row justify-between gap-10 shadow-lg bg-white dark:bg-gray-900 text-black dark:text-gray-200 transition-colors duration-300">
            {data && data.blog && (
                <>
                    {/* Soft Fade-In with Slide-Up for Main Content */}
                    <motion.div
                        className="border dark:border-gray-700 rounded w-full md:w-[70%] p-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200">{data.blog.category.name}</span>
                            {data.blog.tags?.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">#{tag}</span>)}
                        </div>
                        <h1 className="mb-3 text-3xl font-bold tracking-tight dark:text-white md:text-4xl">{data.blog.title}</h1>
                        {data.blog.excerpt && <p className="mb-5 text-lg leading-8 text-muted-foreground">{data.blog.excerpt}</p>}

                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={data.blog.author.avatar} />
                                </Avatar>
                                <div>
                                    <p className="dark:text-gray-300">{data.blog.author.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{moment(data.blog.publishedAt || data.blog.createdAt).format('DD MMM YYYY')}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><FiClock /> {data.blog.readingTime || 1} min read</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><FiEye /> {data.blog.viewCount || 0}</span>
                                <LikeCount props={{ blogid: data.blog._id }} />
                                <CommentCount props={{ blogid: data.blog._id }} />
                            </div>
                        </div>

                        {/* Soft Fade-In with Subtle Zoom Effect for the Image */}
                        <motion.div
                            className="my-5 rounded-lg h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-800"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <img draggable="false" className="rounded-lg w-full h-full shadow-lg object-contain" src={data.blog.featuredImage} alt={data.blog.featuredImageAlt || data.blog.title} />
                        </motion.div>

                        {/* Content Fade-In with Slight Scale-Up */}
                        <motion.div
                            className="prose prose-lg dark:prose-invert max-w-none dark:text-gray-300"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            dangerouslySetInnerHTML={{ __html: safeContent }}
                        >
                            

                        </motion.div>


                        {/* Comments Section */}
                        <div className="border-t dark:border-gray-700 mt-5 pt-5">
                            <Comment props={{ blogid: data.blog._id, refresh: setreFresh }} />
                        </div>

                        <div className="border-t dark:border-gray-700 mt-5 pt-5">
                            <CommentList props={{ blogid: data.blog._id, refresh }} />
                        </div>
                    </motion.div>
                </>
            )}

            {/* Related Blogs Section: Fade-In with Delay */}
            <motion.div
                className="border dark:border-gray-700 rounded w-full md:w-[30%] mt-5 md:mt-0 shadow-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <RelatedBlog props={{ category, currBlog: blog }} />
            </motion.div>
        </div>
    );
};

export default BlogDetails;
