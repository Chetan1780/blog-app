import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { IoMdSearch } from "react-icons/io";

const SearchResult = () => {
const [searchParams] = useSearchParams();
const q = searchParams.get('q')
const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/search?q=${q}`, {
    method: 'get',
    credentials: 'include'
},[q]);
if(loading) return <Loading/>
  return (
    <>
    <div className='flex items-center gap-2 text-xs md:text-2xl text-purple-600 font-semibold pb-3'>
    <IoMdSearch />
    <h4 className=''>{`Search Result For: ${q}`}</h4>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      {blogData && blogData.blog.length>0?
      blogData.blog.map(blog=>{
        return <BlogCard key={blog._id} props={blog} />
      }):
      <div>Data Not Found!!!</div>
      }
    </div>
    </>
  )
}

export default SearchResult