import React from 'react'
import loadingIcon from '@/assets/Images/loading.svg'
const Loading = () => {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center'>
        <img draggable="false" src={loadingIcon} width={100} alt="" />
    </div>
  )
}

export default Loading