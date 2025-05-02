import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../index.css';

const Stats = ({ stats }) => {
  return (
    <ul className="stats-list">
      {stats?.map((stat) => (
        <li key={stat.stat.name}>
          <strong>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:</strong> {stat.base_stat}
        </li>
      ))}
    </ul>
  );
};

const Abilities = ({ abilities }) => {
  return (
    <ul className="abilities-list">
      {abilities?.map((ability) => (
        <li key={ability.ability.name}>
          {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
          {ability.is_hidden && ' (Hidden)'}
        </li>
      ))}
    </ul>
  );
};

const Moves = ({ moves }) => {
  return (
    <ul className="moves-list">
      {moves?.slice(0, 10).map((move) => ( // Displaying first 10 moves for brevity
        <li key={move.move.name}>
          {move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}
        </li>
      ))}
    </ul>
  );
};

const EvolutionChain = ({ evolutionChain }) => {
    const [evolution, setEvolution] = useState([]);

    useEffect(() => {
        const fetchEvolution = async (url) => {
            const res = await fetch(url);
            const data = await res.json();
            return data;
        };

        const processEvolution = async (chain) => {
            const evo = [];
            let current = chain;
            while (current) {
                const speciesData = await fetchEvolution(current.species.url);
                evo.push({ name: current.species.name, id: speciesData.id });
                if (current.evolves_to.length > 0) {
                    current = current.evolves_to[0];
                } else {
                    current = null;
                }
            }
            setEvolution(evo);
        };

        if (evolutionChain) {
            processEvolution(evolutionChain);
        }
    }, [evolutionChain]);

    return (
        <div className="evolution-chain">
            <h3>Evolution Chain:</h3>
            {evolution.length > 0 ? (
                evolution.map((pokemon) => (
                    <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="evolution-pokemon">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} ({pokemon.id})
                    </Link>
                ))
            ) : (
                <p>No evolution information available.</p>
            )}
        </div>
    );
};

const PokemonDetail = () => {
  const { id } = useParams();
  const { data: pokemon, loading, error } = useFetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const [speciesUrl, setSpeciesUrl] = useState(null);
  const { data: speciesData } = useFetch(speciesUrl);
  const [evolutionChainUrl, setEvolutionChainUrl] = useState(null);
  const { data: evolutionChainData } = useFetch(evolutionChainUrl);

  useEffect(() => {
    if (speciesData?.evolution_chain?.url) {
      setEvolutionChainUrl(speciesData.evolution_chain.url);
    }
  }, [speciesData]);

  useEffect(() => {
    if (pokemon?.species?.url) {
      setSpeciesUrl(pokemon.species.url);
    }
  }, [pokemon]);

  if (loading) {
    return <div>Loading Pokémon details...</div>;
  }

  if (error) {
    return <div>Error loading Pokémon details: {error}</div>;
  }

  if (!pokemon) {
    return <div>Pokémon not found.</div>;
  }

  return (
    <div className="pokemon-detail-container container short-container">
      <Link to="/" className="back-link">
        &larr; Back to List
      </Link>
      <header>
        <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
        <img
          src={pokemon.sprites?.other?.official_artwork?.front_default || pokemon.sprites?.front_default}
          alt={pokemon.name}
          className="pokemon-detail-image"
        />
        <div className="pokemon-info pokemon-highlight">
          {pokemon.types?.map((t) => (
            <p key={t.type.name}>{t.type.name}</p>
          ))}
        </div>
      </header>

      <section className="detail-section">
        <h2>Stats</h2>
        <Stats stats={pokemon.stats} />
      </section>

      <section className="detail-section">
        <h2>Abilities</h2>
        <Abilities abilities={pokemon.abilities} />
      </section>

      <section className="detail-section">
        <h2>Moves</h2>
        <Moves moves={pokemon.moves} />
      </section>

      {evolutionChainData && (
        <section className="detail-section">
          <EvolutionChain evolutionChain={evolutionChainData.chain} />
        </section>
      )}
      {!evolutionChainData && speciesData && (
        <p>No evolution chain data available for this Pokémon.</p>
      )}
      {!speciesData && <p>Could not load species information for evolution details.</p>}
    </div>
  );
};

export default PokemonDetail;

