import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import usericon from '@/assets/Images/user.png';
import moment from 'moment/moment';
import { motion } from 'framer-motion';

const CommentList = ({ props }) => {
    const { data, loading, error } = usefetch(
        `${getEnv('VITE_API_BACKEND_URL')}/comment/get-comments/${props.blogid}`,
        {
            method: 'get',
            credentials: 'include'
        },
        [props.refresh]
    );

    if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading comments...</div>;

    return (
        <motion.div
            className="border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 p-5 rounded-lg shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <h3 className="text-xl font-bold dark:text-white">
                <span className="text-purple-700">{data && data.comments.length}</span> Comments
            </h3>

            <div className="mt-5">
                {data && data.comments.length > 0 ? (
                    data.comments.map(comment => (
                        <div key={comment._id} className="border-b dark:border-gray-700 pb-4 mb-4">
                            <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                                <Avatar className="w-10 h-10 rounded-full shadow-md">
                                    <AvatarImage src={comment?.user?.avatar || usericon} />
                                </Avatar>

                                <div className="flex flex-col ml-3 space-y-2 w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-300">
                                            {comment?.user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {moment(comment.createdAt).format('DD-MM-YYYY')}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        {comment?.comment}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </motion.div>
    );
};

export default CommentList;
