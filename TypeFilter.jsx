import React, { useContext, useState, useCallback } from 'react';
import { PokemonContext } from '../contexts/PokemonContext';
import '../index.css';

const TypeFilter = ({ onTypeChange }) => {
  const { pokemonTypes } = useContext(PokemonContext);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleCheckboxChange = useCallback((event) => {
    const type = event.target.value;
    const isChecked = event.target.checked;

    setSelectedTypes((prevTypes) =>
      isChecked
        ? [...prevTypes, type]
        : prevTypes.filter((t) => t !== type)
    );
    onTypeChange(type, isChecked); // Notify parent about individual type changes
  }, [onTypeChange]);

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
              disabled={type === 'all'} // Disable 'all' checkbox as it's a reset
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;