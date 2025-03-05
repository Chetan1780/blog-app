import React, { useState } from 'react';
import { Input } from './ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RouteSearch } from '@/Helper/RouteName';
import { debounce } from 'lodash';

const SearchBox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  // Debounced function to update the URL when the user types
  const updateSearchParams = debounce((searchTerm) => {
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
      navigate(RouteSearch(searchTerm), { replace: true });
    } else {
      setSearchParams({});
    }
  }, 500);

  // Handle input change but do NOT trigger navigation immediately
  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    updateSearchParams(searchTerm); // Updates URL with debounce
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        name="query"
        value={query}
        onChange={handleInputChange} // Only update on user input
        className="h-10 rounded-2xl mx-auto text-xs bg-gray-50 md:text-xl font-semibold p-2 w-1/2 md:w-full"
        placeholder="Search here...."
      />
    </form>
  );
};

export default SearchBox;
