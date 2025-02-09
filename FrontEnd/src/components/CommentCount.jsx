import { getEnv } from '@/Helper/getEnv'
import { usefetch } from '@/hooks/usefetch'
import React from 'react'
import { FaComment } from "react-icons/fa";

const CommentCount = ({props}) => {
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/comment/get-count/${props.blogid}`, {
        method: 'get', credentials: 'include'
    })
    // console.log(data);
  return (
    <div>
        <button type='button' className="flex justify-center items-center gap-2 text-purple-700">
        <FaComment />
        {data && data.count}
        </button>
    </div>
  )
}

export default CommentCount