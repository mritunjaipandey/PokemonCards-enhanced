import React, { useState, useContext, useMemo } from 'react';
import { PokemonContext } from '../contexts/PokemonContext';
import { PokemonCard } from './PokemonCard';
import '../index.css';

const itemsPerPageOptions = [10, 20, 50];

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [...Array(totalPages).keys()].map((number) => number + 1);

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

const SortOptions = ({ sortBy, onSortChange }) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" value={sortBy} onChange={onSortChange}>
        <option value="id">ID</option>
        <option value="name">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};

const TypeFilter = ({ onTypeChange }) => {
  const { pokemonTypes } = useContext(PokemonContext);
  const [selectedTypes, setSelectedTypes] = useState([]);

    const handleCheckboxChange = (event) => {
        const type = event.target.value;
        const isChecked = event.target.checked;

        setSelectedTypes((prevTypes) =>
            isChecked
                ? [...prevTypes, type]
                : prevTypes.filter((t) => t !== type)
        );
        onTypeChange(type, isChecked);
    };

  return (
    <div className="pokemon-filter">
      <label>Filter by Type:</label>
      <div className="type-checkboxes">
        {pokemonTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={handleCheckboxChange}
              disabled={type === 'all'}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

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

export const PokemonList = () => {
  const { allPokemon, loading, error } = useContext(PokemonContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('id');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

    const handleTypeFilterChange = (type, isChecked) => {
        setSelectedTypes((prevTypes) =>
            isChecked ? [...prevTypes, type] : prevTypes.filter((t) => t !== type)
        );
        setCurrentPage(1);
    };

  const handleSortChange = (event) => {  // Define the function here
    setSortBy(event.target.value);
  };

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTypes.length === 0 || pokemon.types.some((t) => selectedTypes.includes(t.type.name)))
    );
  }, [allPokemon, searchQuery, selectedTypes]);

  const sortedPokemon = useMemo(() => {
    let sorted = [...filteredPokemon];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'id':
      default:
        sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
  }, [filteredPokemon, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemon = sortedPokemon.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPokemon.length / itemsPerPage);

  if (loading) {
    return <div>Loading Pokémon...</div>;
  }

  if (error) {
    return <div>Error loading Pokémon: {error}</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Pokémon Explorer</h1>
      </header>
      <SearchBar onSearch={handleSearch} />
            <TypeFilter onTypeChange={handleTypeFilterChange} />
      <SortOptions sortBy={sortBy} onSortChange={handleSortChange} />
      <div className="items-per-page">
        <label htmlFor="items-per-page">Items per page:</label>
        <select id="items-per-page" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <ul className="cards">
        {currentPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
