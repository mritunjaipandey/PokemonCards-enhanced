import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PokemonContext } from '../contexts/PokemonContext';
import '../index.css';

const FavoritesList = () => {
  const { allPokemon, favorites, toggleFavorite } = useContext(PokemonContext);

  const favoritePokemonData = allPokemon.filter((pokemon) => favorites.includes(pokemon.id));

  if (favoritePokemonData.length === 0) {
    return (
      <div className="container short-container">
        <h2>Your Favorite Pokémon</h2>
        <p>You haven't favorited any Pokémon yet.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Favorite Pokémon</h2>
      <ul className="cards">
        {favoritePokemonData.map((pokemon) => (
          <li key={pokemon.id} className="pokemon-card">
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
              className={`favorite-button is-favorite`}
            >
              Unfavorite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;