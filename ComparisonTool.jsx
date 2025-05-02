import React, { useState, useContext, useCallback } from 'react';
import { PokemonContext } from '../contexts/PokemonContext';
import '../index.css';

const ComparisonTool = () => {
  const { allPokemon } = useContext(PokemonContext);
  const [pokemon1Id, setPokemon1Id] = useState('');
  const [pokemon2Id, setPokemon2Id] = useState('');

  const pokemonOptions = allPokemon.map((pokemon) => ({
    value: pokemon.id,
    label: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} (#${pokemon.id})`,
  }));

  const handleChangePokemon1 = useCallback((event) => {
    setPokemon1Id(event.target.value);
  }, []);

  const handleChangePokemon2 = useCallback((event) => {
    setPokemon2Id(event.target.value);
  }, []);

  const pokemon1 = allPokemon.find((p) => p.id === parseInt(pokemon1Id));
  const pokemon2 = allPokemon.find((p) => p.id === parseInt(pokemon2Id));

  // Local component for displaying a single Pokemon in comparison view
  const PokemonComparisonCard = ({ pokemon }) => {
    return (
      <div className="comparison-card">
        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <img
          src={pokemon.sprites?.other?.official_artwork?.front_default || pokemon.sprites?.front_default}
          alt={pokemon.name}
          className="comparison-image"
        />
        <ul className="stats-list">
          {pokemon.stats?.map((stat) => (
            <li key={stat.stat.name}>
              <strong>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:</strong> {stat.base_stat}
            </li>
          ))}
        </ul>
        {/* Add more details as needed */}
      </div>
    );
  };

  return (
    <div className="container short-container">
      <h2>Compare Pokémon</h2>
      <div className="comparison-select">
        <label htmlFor="pokemon1">Pokémon 1:</label>
        <select id="pokemon1" value={pokemon1Id} onChange={handleChangePokemon1}>
          <option value="">Select a Pokémon</option>
          {pokemonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="pokemon2">Pokémon 2:</label>
        <select id="pokemon2" value={pokemon2Id} onChange={handleChangePokemon2}>
          <option value="">Select a Pokémon</option>
          {pokemonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="comparison-cards">
        {pokemon1 && <PokemonComparisonCard pokemon={pokemon1} />}
        {pokemon2 && <PokemonComparisonCard pokemon={pokemon2} />}
      </div>
      {!pokemon1 && pokemon2 && <p>Select the first Pokémon to compare.</p>}
      {pokemon1 && !pokemon2 && <p>Select the second Pokémon to compare.</p>}
      {!pokemon1 && !pokemon2 && <p>Select two Pokémon to compare their stats.</p>}
    </div>
  );
};

export default ComparisonTool;
