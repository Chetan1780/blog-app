import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React from 'react'
import { useParams } from 'react-router-dom'
import { BiSolidCategory } from "react-icons/bi";
import { motion } from 'framer-motion';

const BlogByCategory = () => {
    const { category } = useParams();
    const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/getblogbycategory/${category}`, {
        method: 'get',
        credentials: 'include'
    }, [category]);

    if (loading) return <Loading />;

    return (
        <>
            <div className='flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-purple-600 font-semibold pb-3'>
                <BiSolidCategory />
                <h4 className='underline'>
                    {blogData && blogData.categoryData?.name}
                </h4>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 md:gap-10'>
                {blogData && blogData.blog.length > 0 ?
                    blogData.blog.map((blog, index) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.1,
                                type: 'spring',
                                stiffness: 80,
                                damping: 30,
                            }}
                        >
                            <BlogCard key={blog._id} props={blog} />
                        </motion.div>
                    ))
                    :
                    <div className="text-center text-gray-600 text-sm sm:text-base">No blogs found.</div>
                }
            </div>
        </>
    )
}

export default BlogByCategory;
