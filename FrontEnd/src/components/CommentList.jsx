import { getEnv } from '@/Helper/getEnv';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import usericon from '@/assets/Images/user.png';
import moment from 'moment';
import { motion } from 'framer-motion';

const CommentList = ({ props }) => {
    const [comments, setComments] = useState([]); // 🔥 Fixed: Now stores actual comments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const resp = await fetch(
                `${getEnv('VITE_API_BACKEND_URL')}/comment/get-comments/${props.blogid}`,
                { method: 'GET', credentials: 'include' }
            );
            const temp = await resp.json();
    
            if (resp.ok) {
                
                setComments(temp.comments)
                setLoading(false);
            } else {
                setComments([]); 
                setError(temp.message);
                setLoading(false);
            }
        } catch (error) {
            setComments([]);
            setError("Error fetching comment list");
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchComments();

        const interval = setInterval(fetchComments, 300000); 

        return () => clearInterval(interval);
    }, [props.blogid, props.refresh]);

    if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading comments...</div>;
    // if (error) return <div className="text-red-500">{error}</div>; // 🔥 Show error message if fetching fails

    return (
        <motion.div
            className="border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 p-5 rounded-lg shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <h3 className="text-xl font-bold dark:text-white">
                <span className="text-purple-700">{comments.length}</span> Comments
            </h3>

            <div className="mt-5">
                {comments.length > 0 ? (
                    comments.map(comment => (
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
