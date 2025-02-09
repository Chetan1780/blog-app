import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React from 'react'
import { useParams } from 'react-router-dom'
import { BiSolidCategory } from "react-icons/bi";
import { motion } from 'framer-motion'; // Import motion for animations

const BlogByCategory = () => {
    const { category } = useParams();
    const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/getblogbycategory/${category}`, {
        method: 'get',
        credentials: 'include'
    }, [category]);

    if (loading) return <Loading />;
    console.log(blogData);

    return (
        <>
            <div className='flex items-center gap-2 text-2xl text-purple-600 font-semibold pb-3'>
                <BiSolidCategory />
                <h4 className='underline'>
                    {blogData && blogData.categoryData?.name}
                </h4>
            </div>

            <div className='grid grid-cols-3 gap-10'>
                {blogData && blogData.blog.length > 0 ?
                    blogData.blog.map((blog, index) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }} // Initial state: off-screen and transparent
                            animate={{ opacity: 1, y: 0 }}  // Final state: fully visible and aligned
                            transition={{
                                delay: index * 0.1,             // Staggered delay for each blog card
                                type: 'spring',                 // Use spring-based animation
                                stiffness: 80,                 // Stiffness for the spring
                                damping: 30,                    // Damping to reduce the overshoot
                            }}
                        >
                            <BlogCard key={blog._id} props={blog} />
                        </motion.div>
                    ))
                    :
                    <div>Data Not Found!!!</div>
                }
            </div>
        </>
    )
}

export default BlogByCategory;
