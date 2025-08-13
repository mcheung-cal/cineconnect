import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Movie } from '../types';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = [...movies];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const allGenres = Array.from(new Set(movies.flatMap(movie => movie.genre))).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Movie Database</h1>
        <p className="text-xl text-gray-600">
          Discover and explore our collection of movies
        </p>
      </div>

      {/* Filters and Search */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Movies
            </label>
            <input
              type="text"
              placeholder="Search by title, director..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              className="input-field"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="year">Year (Newest First)</option>
              <option value="rating">Rating (Highest First)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSortBy('title');
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredMovies.length} of {movies.length} movies
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="card hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{movie.year} • {movie.director}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{movie.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-500 font-medium">⭐ {movie.rating}</span>
                <span className="text-xs text-gray-500">{movie.genre.slice(0, 2).join(', ')}</span>
              </div>
              
              <div className="border-t pt-2">
                <p className="text-xs text-gray-500">
                  Available on: {movie.streamingPlatforms.slice(0, 2).join(', ')}
                  {movie.streamingPlatforms.length > 2 && ` +${movie.streamingPlatforms.length - 2} more`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No movies found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedGenre
              ? 'Try adjusting your search criteria'
              : 'No movies available at the moment'
            }
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-primary-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't decide what to watch?</h2>
        <p className="text-gray-600 mb-6">
          Take our personalized quiz to get movie recommendations based on your preferences!
        </p>
        <Link to="/quiz" className="btn-primary">
          Take the Quiz
        </Link>
      </div>
    </div>
  );
};

export default Movies;
