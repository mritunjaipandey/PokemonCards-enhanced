import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PokemonProvider } from './contexts/PokemonContext';
import { PokemonList } from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import FavoritesList from './components/FavoritesList';
import ComparisonTool from './components/ComparisonTool';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <PokemonProvider>
        <Router>
          <nav className="main-nav container">
            <ul>
              <li>
                <Link to="/">Pokémon List</Link>
              </li>
              <li>
                <Link to="/favorites">Favorites</Link>
              </li>
              <li>
                <Link to="/compare">Compare</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/favorites" element={<FavoritesList />} />
            <Route path="/compare" element={<ComparisonTool />} />
          </Routes>
        </Router>
      </PokemonProvider>
    </ErrorBoundary>
  );
};

export default App;