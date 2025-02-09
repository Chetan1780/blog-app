import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import { usefetch } from '@/hooks/usefetch';
import React, { useEffect, useState } from 'react';
import { FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaRegHeart } from "react-icons/fa";
const LikeCount = ({ props }) => {
  const user = useSelector((state) => state.persistedReducer.user);
  let data;
  if(user.isLoggedIn){
    const { data:likes, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/like/get-like/${props.blogid}/${user.isLoggedIn?user.user._id:" "}`, {
      method: 'get', credentials: 'include'
    });
    data = likes;
  } else{
    const { data:likes, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/like/get-like/${props.blogid}`, {
      method: 'get', credentials: 'include'
    });
    data = likes;

  }

  const [likeCount, setlikeCount] = useState(0);
  const [animate, setAnimate] = useState(false); 
  const [liked,setLiked] = useState(false)
  useEffect(() => {
    if (data) {
      setlikeCount(data.countLike);
      setLiked(data.isLikedByUser)
    }
  }, [data]);
  console.log(data);
  

  const handleLike = async () => {
    try {
      if (!user.isLoggedIn) {
        return showToast('error', 'Please login into your account!!');
      }

      const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/like/toggleLike`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: user.user._id, blogid: props.blogid }),
      });

      const temp = await resp.json();
      if (!resp.ok) {
        showToast('error', temp.message);
        return;
      }

      setlikeCount(temp.countLike);
      setLiked(!liked);
      setAnimate(true);

      setTimeout(() => setAnimate(false), 300);
    } catch (err) {
      showToast('error', err.message);
    }
  };

  return (
    <div>
      <button
        type='button'
        onClick={handleLike}
        className="flex justify-center items-center gap-2 text-red-700"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.3 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          {!liked?<FaRegHeart />:
            <FaHeart />}
        </motion.div>
        <motion.div
          key={likeCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }} 
        >
          {likeCount}
        </motion.div>
      </button>
    </div>
  );
};

export default LikeCount;
