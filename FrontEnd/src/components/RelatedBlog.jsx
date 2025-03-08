import { getEnv } from '@/Helper/getEnv';
import { RouteBlogDetails } from '@/Helper/RouteName';
import { usefetch } from '@/hooks/usefetch';
import React from 'react';
import { Link } from 'react-router-dom';

const RelatedBlog = ({ props }) => {
    const { data, loading, error } = usefetch(
        `${getEnv('VITE_API_BACKEND_URL')}/blog/getrelatedblog/${props.category}/${props.currBlog}`,
        {
            method: 'get',
            credentials: 'include'
        },
        []
    );

    if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;

    return (
        <div className="p-4 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Related Blogs</h2>
            <div className="flex gap-5 flex-col">
                {data && data.blog.length > 0 ? (
                    data.blog.map((blog) => (
                        <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
                            <div className="flex flex-col lg:flex-row items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
                                <img
                                    draggable="false"
                                    className="w-[120px] rounded-md h-[90px] object-cover bg-gray-100 dark:bg-gray-800"
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                />
                                <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {blog.title}
                                </h4>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-gray-600 dark:text-gray-400">No Related Blogs Available</div>
                )}
            </div>
        </div>
    );
};

export default RelatedBlog;
