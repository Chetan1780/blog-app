import { getEnv } from '@/Helper/getEnv';
import { RouteBlogDetails } from '@/Helper/RouteName';
import { usefetch } from '@/hooks/usefetch';
import { Separator } from '@radix-ui/react-separator';
import React from 'react'
import { Link } from 'react-router-dom';

const RelatedBlog = ({props}) => {
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/getrelatedblog/${props.category}/${props.currBlog}`, {
        method: 'get',
        credentials: 'include'
    },[]);
    console.log(data)
    if(loading) return <div>Loading...</div>
  
  return (
    <div className='p-4'>
        <h2 className='text-xl font-bold mb-3'>Related Blogs</h2>
        <div className='flex gap-5 flex-col'>
            {data && data.blog.length > 0 ? 
                data.blog.map(blog => {
                    return (
                        <Link key={blog._id} to={RouteBlogDetails(props.category,blog.slug)} >
                        <div  className='flex flex-col lg:flex-row  items-center gap-4 p-3 border-b border-gray-200'>
                            <img className='w-[120px] rounded-md h-[90px] object-cover' src={blog.featuredImage} alt={blog.title} />
                            <h4 className='text-base font-semibold text-gray-700 line-clamp-2'>{blog.title}</h4>
                        </div>
                        </Link>
                    );
                })
            : <div>No Related Blogs Available</div>}
        </div>
    </div>
  )
}

export default RelatedBlog;
