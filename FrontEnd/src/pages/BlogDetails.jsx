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
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '@/components/Loading';

const BlogDetails = () => {
    const { blog, category } = useParams();
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/getblog/${blog}`, {
        method: 'get', credentials: 'include'
    }, [blog, category]);

    const [refresh, setreFresh] = useState();

    useEffect(() => {}, [refresh]);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col md:flex-row justify-between gap-10">
            {data && data.blog && (
                <>
                    {/* Soft Fade-In with Slide-Up for Main Content */}
                    <motion.div
                        className="border rounded w-full md:w-[70%] p-5"
                        initial={{ opacity: 0, y: 20 }} // Start below and invisible
                        animate={{ opacity: 1, y: 0 }} // Fade in and slide up
                        transition={{ duration: 1.2, ease: "easeOut" }} // Smooth easing
                    >
                        <h1 className="text-xl font-bold mb-5">{data.blog.title}</h1>

                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={data.blog.author.avatar} />
                                </Avatar>
                                <div>
                                    <p>{data.blog.author.name}</p>
                                    <p className="text-xs text-gray-500">{moment(data.blog.createdAt).format('DD-MM-YYYY')}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <LikeCount props={{ blogid: data.blog._id }} />
                                <CommentCount props={{ blogid: data.blog._id }} />
                            </div>
                        </div>

                        {/* Soft Fade-In with Subtle Zoom Effect for the Image */}
                        <motion.div
                            className="my-5"
                            initial={{ opacity: 0, scale: 0.95 }} // Start small and invisible
                            animate={{ opacity: 1, scale: 1 }} // Fade in and zoom up to full size
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <img className="rounded w-full" src={data.blog.featuredImage} alt={data.blog.title} />
                        </motion.div>

                        {/* Content Fade-In with Slight Scale-Up */}
                        <motion.div
                            className="blog-content"
                            initial={{ opacity: 0, scale: 0.98 }} // Start small and invisible
                            animate={{ opacity: 1, scale: 1 }} // Fade in with a subtle scale-up
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            dangerouslySetInnerHTML={{ __html: decode(data.blog.content) || '' }}
                        />

                        {/* Comments Section */}
                        <div className="border-t mt-5 pt-5">
                            <Comment props={{ blogid: data.blog._id, refresh: setreFresh }} />
                        </div>

                        <div className="border-t mt-5 pt-5">
                            <CommentList props={{ blogid: data.blog._id, refresh }} />
                        </div>
                    </motion.div>
                </>
            )}

            {/* Related Blogs Section: Fade-In with Delay */}
            <motion.div
                className="border rounded w-full md:w-[30%] mt-5 md:mt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }} // Delay to stagger animation
            >
                <RelatedBlog props={{ category, currBlog: blog }} />
            </motion.div>
        </div>
    );
};

export default BlogDetails;
