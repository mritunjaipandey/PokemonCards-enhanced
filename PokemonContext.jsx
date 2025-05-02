import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [pokemonTypes, setPokemonTypes] = useState(['all']);

  const API_BASE_URL = "https://pokeapi.co/api/v2";
  const POKEMON_LIMIT = 150;

  const fetchPokemonList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
      const data = await res.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return await res.json();
        })
      );
      setAllPokemon(detailedPokemon);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchPokemonTypes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/type`);
      const data = await res.json();
      const typeNames = data.results.map((type) => type.name);
      setPokemonTypes(['all', ...typeNames]);
    } catch (err) {
      console.error("Error fetching Pokemon types:", err);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchPokemonList();
    fetchPokemonTypes();
  }, [fetchPokemonList, fetchPokemonTypes]);

  useEffect(() => {
    localStorage.setItem('favoritePokemon', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((pokemonId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(pokemonId)) {
        return prevFavorites.filter((id) => id !== pokemonId);
      } else {
        return [...prevFavorites, pokemonId];
      }
    });
  }, []);

  const isFavorite = useCallback((pokemonId) => favorites.includes(pokemonId), [favorites]);

  const getRandomPokemon = useCallback(() => {
    if (allPokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPokemon.length);
      return allPokemon[randomIndex];
    }
    return null;
  }, [allPokemon]);

  const contextValue = useMemo(() => ({
    allPokemon,
    loading,
    error,
    favorites,
    toggleFavorite,
    isFavorite,
    pokemonTypes,
    getRandomPokemon,
  }), [allPokemon, loading, error, favorites, toggleFavorite, isFavorite, pokemonTypes, getRandomPokemon]);

  return (
    <PokemonContext.Provider value={contextValue}>
      {children}
    </PokemonContext.Provider>
  );
};