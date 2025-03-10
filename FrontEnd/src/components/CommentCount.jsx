import { getEnv } from '@/Helper/getEnv';
import React, { useEffect, useState } from 'react';
import { FaComment } from "react-icons/fa";

const CommentCount = ({ props }) => {
    const [commentCount, setCommentCount] = useState(0);

    // Function to fetch comment count
    const fetchCommentCount = async () => {
        try {
            const response = await fetch(
                `${getEnv('VITE_API_BACKEND_URL')}/comment/get-count/${props.blogid}`,
                { method: 'GET', credentials: 'include' }
            );

            const data = await response.json();
            if (response.ok) {
                setCommentCount(data.count);
            }
        } catch (error) {
            console.error("Error fetching comment count:", error);
        }
    };

    // 🔥 Polling using useEffect
    useEffect(() => {
        fetchCommentCount(); // Fetch initially
        const interval = setInterval(fetchCommentCount, 70000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [props.blogid]); // Re-run when blog ID changes

    return (
        <div>
            <button type='button' className="flex justify-center items-center gap-2 text-purple-700">
                <FaComment />
                {commentCount}
            </button>
        </div>
    );
};

export default CommentCount;
