import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/Helper/getEnv';
import { usefetch } from '@/hooks/usefetch';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query);
    }, 300); 

    handler();
    return () => handler.cancel();
  }, [query]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const { data: blogData, loading, error } = usefetch(
    `${getEnv('VITE_API_BACKEND_URL')}/blog/search?${new URLSearchParams({ q: debouncedQuery }).toString()}`,
    { method: 'get', credentials: 'include' },
    [debouncedQuery]
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load search results. Please try again.</div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {blogData?.blog?.length > 0 ? (
            blogData.blog.map(blog => <BlogCard key={blog._id} props={blog} />)
          ) : (
            <div>Data Not Found!!!</div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchResult;
