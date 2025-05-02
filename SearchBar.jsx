import React, { useState, useCallback } from 'react';
import '../index.css';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    onSearch(searchQuery);
  }, [onSearch, searchQuery]);

  return (
    <form className="pokemon-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchQuery}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;