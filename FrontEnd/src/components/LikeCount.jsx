import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import { usefetch } from '@/hooks/usefetch';
import React, { useEffect, useState, useCallback } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

const LikeCount = ({ props }) => {
  const user = useSelector((state) => state.persistedReducer.user);
  const userId = user.isLoggedIn ? user.user._id : null;
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Fetch likes data
  const { data } = usefetch(
    `${getEnv('VITE_API_BACKEND_URL')}/like/get-like/${props.blogid}${userId ? `/${userId}` : ''}`,
    { method: 'get', credentials: 'include' },
    [props.blogid, userId]
  );

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      setLikeCount(data.countLike);
      setLiked(data.isLikedByUser);
    }
  }, [data]);

  // Debounced API call (waits 500ms before updating backend)
  const updateLikeInBackend = useCallback(
    debounce(async (newLikedState) => {
      try {
        const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/like/toggleLike`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid: userId, blogid: props.blogid }),
        });

        const temp = await resp.json();
        if (!resp.ok) {
          showToast('error', temp.message);
          return;
        }

        // Ensure count matches backend response
        setLikeCount(temp.countLike);
      } catch (err) {
        showToast('error', err.message);
      }
    }, 500),
    [userId, props.blogid]
  );

  const handleLike = () => {
    if (!user.isLoggedIn) {
      return showToast('error', 'Please login into your account!');
    }

    // Instantly update UI
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount((prevCount) => prevCount + (newLikedState ? 1 : -1));
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    // Call the debounced function
    updateLikeInBackend(newLikedState);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleLike}
        className="flex justify-center items-center gap-2 text-red-700"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.3 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </motion.div>
        <motion.div
          key={likeCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {likeCount}
        </motion.div>
      </button>
    </div>
  );
};

export default LikeCount;
