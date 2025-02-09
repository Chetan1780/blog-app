import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom';
import { RouteSearch } from '@/Helper/RouteName';

const SearchBox = () => {
  const [query,setQuery] = useState();
  const navigate = useNavigate();
  const getInput = (e)=>{
    setQuery(e.target.value);
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    navigate(RouteSearch(query))
  }
  return (
    <form onSubmit={handleSubmit}>
       <Input
        name="query"
        value={query}
        onInput={getInput}
        className="h-10 rounded-2xl mx-auto text-xs bg-gray-50 md:text-xl font-semibold p-2 w-1/2 md:w-full"
        placeholder="Search here...."
      />
    </form>
  )
}

export default SearchBox