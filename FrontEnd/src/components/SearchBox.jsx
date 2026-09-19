import React, { useEffect, useMemo, useState } from 'react';
import { Input } from './ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteIndex, RouteSearch } from '@/Helper/RouteName';
import { debounce } from 'lodash';

const SearchBox = () => {
  const location = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '');
  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = location.pathname === RouteSearch()
      ? new URLSearchParams(location.search).get('q') || ''
      : '';
    setQuery(searchQuery);
  }, [location.pathname, location.search]);

  const updateSearchRoute = useMemo(
    () => debounce((searchTerm) => {
      const trimmedSearchTerm = searchTerm.trim();
      navigate(trimmedSearchTerm ? RouteSearch(trimmedSearchTerm) : RouteIndex, { replace: true });
    }, 500),
    [navigate]
  );

  useEffect(() => () => updateSearchRoute.cancel(), [updateSearchRoute]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    updateSearchRoute(searchTerm);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        name="query"
        value={query}
        onChange={handleInputChange}
        className="h-10 rounded-2xl mx-auto text-xs md:text-xl font-semibold p-2 w-1/2 md:w-full 
                   bg-gray-50 dark:bg-gray-800 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Search here...."
      />
    </form>
  );
};

export default SearchBox;
