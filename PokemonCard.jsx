import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PokemonContext } from '../contexts/PokemonContext';
import '../index.css';

export const PokemonCard = ({ pokemon }) => {
  const { isFavorite, toggleFavorite } = useContext(PokemonContext);
  const isCurrentlyFavorite = isFavorite(pokemon.id);

  return (
    <li className="pokemon-card">
      <Link to={`/pokemon/${pokemon.id}`}>
        <figure>
          <img
            src={pokemon.sprites?.other?.dream_world?.front_default || pokemon.sprites?.front_default}
            alt={pokemon.name}
            className="pokemon-image"
          />
        </figure>
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <div className="pokemon-info pokemon-highlight">
          <p>{pokemon.types?.map((t) => t.type.name).join(', ')}</p>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(pokemon.id)}
        className={`favorite-button ${isCurrentlyFavorite ? 'is-favorite' : ''}`}
      >
        {isCurrentlyFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </li>
  );
};