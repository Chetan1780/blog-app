import React from 'react';
import { motion } from 'framer-motion';  // Import motion
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';

const Index = () => {
  const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/all-blog`, {
      method: 'get',
      credentials: 'include'
  }, []);
  
  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {blogData && blogData.blog.length > 0 ?
        blogData.blog.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 50 }}  // Start position off-screen with 0 opacity
            animate={{ opacity: 1, y: 0 }}   // End position is fully visible
            transition={{
              delay: index * 0.1,  // Stagger the animation slightly for each card
              type: 'spring',     // Type of animation, you can change this to 'tween' or 'spring'
              stiffness: 80,     // Controls the speed of the spring animation
              damping: 30,        // Controls the bounciness of the spring
            }}
          >
            <BlogCard props={blog} />
          </motion.div>
        )) :
        <div>Data Not Found!!!</div>
      }
    </div>
  );
};

export default Index;
