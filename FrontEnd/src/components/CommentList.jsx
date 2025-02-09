import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import usericon from '@/assets/Images/user.png'
import moment from 'moment/moment';
import { Separator } from "@/components/ui/separator"

const CommentList = ({props}) => {
    console.log(props.blogid)
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/comment/get-comments/${props.blogid}`, {
        method: 'get',
        credentials: 'include'
    },[props.refresh]);

    
    if(loading) return <div>Loading...</div>
  return (
    <div>
        <h3 className='text-xl font-bold'><span className='text-purple-700'>{data && data.comments.length}</span> Comments</h3>
        <div className='mt-5'>
            {data && data.comments.length>0 && data.comments.map(comment=>{
                return <div  key={comment._id}>
                      <div className="flex gap-4 items-start p-4 border-b border-gray-200">
                        <Avatar  className="w-10 h-10 rounded-full shadow-md">
                          <AvatarImage src={comment?.user?.avatar || usericon} />
                        </Avatar>
                  
                        <div className="flex flex-col ml-3 space-y-2">
                            <div className='flex justify-between items-center gap-2'>

                          <p className="font-semibold text-sm text-gray-800">{comment?.user?.name}</p>
                          <p className="text-xs text-gray-500">{moment(comment.createdAt).format('DD-MM-YYYY')}</p>
                            </div>
                  
                          <div className="text-sm text-gray-700">
                            {comment?.comment}
                          </div>
                        </div>
                      </div>
                      {/* <Separator className="my-4" /> */}
                    </div>
                  })}
        </div>
    </div>
  )
}

export default CommentList