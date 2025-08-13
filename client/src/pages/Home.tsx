import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Movie, Community, WatchParty } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularCommunities, setPopularCommunities] = useState<Community[]>([]);
  const [upcomingWatchParties, setUpcomingWatchParties] = useState<WatchParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, communitiesRes, watchPartiesRes] = await Promise.all([
          axios.get('/api/movies'),
          axios.get('/api/communities'),
          axios.get('/api/watch-parties')
        ]);

        setFeaturedMovies(moviesRes.data.slice(0, 4));
        setPopularCommunities(communitiesRes.data.slice(0, 3));
        setUpcomingWatchParties(watchPartiesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to CineConnect
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover movies, join communities, and connect with fellow film enthusiasts.
          Get personalized recommendations, discuss your favorite films, and enjoy watch parties together.
        </p>
        {!user && (
          <div className="space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/quiz" className="btn-secondary text-lg px-8 py-3">
              Take Quiz
            </Link>
          </div>
        )}
        {user && (
          <div className="space-x-4">
            <Link to="/quiz" className="btn-primary text-lg px-8 py-3">
              Get Movie Recommendations
            </Link>
            <Link to="/communities" className="btn-secondary text-lg px-8 py-3">
              Browse Communities
            </Link>
          </div>
        )}
      </div>

      {/* Featured Movies */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Movies</h2>
          <Link to="/movies" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.id}`} className="card hover:shadow-xl transition-shadow duration-300">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{movie.year} • {movie.director}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 font-medium">⭐ {movie.rating}</span>
                  <span className="text-xs text-gray-500">{movie.genre.join(', ')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Communities */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Popular Communities</h2>
          <Link to="/communities" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCommunities.map((community) => (
            <Link key={community.id} to={`/communities/${community.id}`} className="card hover:shadow-xl transition-shadow duration-300">
              <img
                src={community.banner}
                alt={community.name}
                className="w-full h-32 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{community.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-medium">{community.memberCount.toLocaleString()} members</span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                    Join
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Watch Parties */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Watch Parties</h2>
          <Link to="/watch-parties" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingWatchParties.map((party) => (
            <div key={party.id} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{party.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{party.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Host:</span>
                    <span className="ml-2">{party.hostUsername}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Platform:</span>
                    <span className="ml-2">{party.platform}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{new Date(party.scheduledFor).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {party.participants.length}/{party.maxParticipants} joined
                  </span>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                    Join Party
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
