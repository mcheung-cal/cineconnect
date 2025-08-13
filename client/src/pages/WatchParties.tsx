import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WatchParty, Movie } from '../types';
import { useAuth } from '../contexts/AuthContext';

const WatchParties: React.FC = () => {
  const { user, token } = useAuth();
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    movieId: '',
    scheduledFor: '',
    platform: '',
    maxParticipants: 10,
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partiesRes, moviesRes] = await Promise.all([
          axios.get('/api/watch-parties'),
          axios.get('/api/movies')
        ]);

        setWatchParties(partiesRes.data);
        setMovies(moviesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await axios.post('/api/watch-parties', formData);
      setWatchParties([response.data, ...watchParties]);
      setFormData({
        title: '',
        movieId: '',
        scheduledFor: '',
        platform: '',
        maxParticipants: 10,
        description: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating watch party:', error);
    }
  };

  const joinParty = async (partyId: string) => {
    if (!token) return;

    try {
      await axios.post(`/api/watch-parties/${partyId}/join`);
      setWatchParties(prev =>
        prev.map(party =>
          party.id === partyId
            ? { ...party, participants: [...party.participants, user!.id] }
            : party
        )
      );
    } catch (error) {
      console.error('Error joining watch party:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMovieTitle = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };

  const getMoviePoster = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.poster : '';
  };

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const upcomingParties = watchParties.filter(party => new Date(party.scheduledFor) > new Date());
  const pastParties = watchParties.filter(party => new Date(party.scheduledFor) <= new Date());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Watch Parties</h1>
        <p className="text-xl text-gray-600">
          Join or create movie watch parties to enjoy films together with fellow movie lovers
        </p>
      </div>

      {/* Create Party Button */}
      {user && (
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ Create Watch Party'}
          </button>
        </div>
      )}

      {/* Create Party Form */}
      {showCreateForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a Watch Party</h2>
          <form onSubmit={handleCreateParty} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="input-field"
                  placeholder="e.g., Marvel Movie Night"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie
                </label>
                <select
                  name="movieId"
                  className="input-field"
                  value={formData.movieId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  className="input-field"
                  value={formData.scheduledFor}
                  onChange={handleInputChange}
                  min={getDefaultDateTime()}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Streaming Platform
                </label>
                <select
                  name="platform"
                  className="input-field"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select platform</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Disney+">Disney+</option>
                  <option value="Amazon Prime">Amazon Prime</option>
                  <option value="HBO Max">HBO Max</option>
                  <option value="Hulu">Hulu</option>
                  <option value="Apple TV+">Apple TV+</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  className="input-field"
                  min="2"
                  max="50"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                className="input-field h-24 resize-none"
                placeholder="Tell people what to expect from this watch party..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Watch Party
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Login Prompt for Non-users */}
      {!user && (
        <div className="card p-6 mb-8 text-center bg-primary-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Join the Community</h3>
          <p className="text-gray-600 mb-4">
            Sign up or log in to create and join watch parties with other movie enthusiasts!
          </p>
          <div className="space-x-3">
            <a href="/register" className="btn-primary">Sign Up</a>
            <a href="/login" className="btn-secondary">Log In</a>
          </div>
        </div>
      )}

      {/* Upcoming Watch Parties */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Watch Parties</h2>
        {upcomingParties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingParties.map((party) => (
              <div key={party.id} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4 p-4 border-b">
                  <img
                    src={getMoviePoster(party.movieId)}
                    alt={getMovieTitle(party.movieId)}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{party.title}</h3>
                    <p className="text-gray-600 text-sm">{getMovieTitle(party.movieId)}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-4">{party.description}</p>
                  
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
                      <span className="font-medium">When:</span>
                      <span className="ml-2">{formatDate(party.scheduledFor)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {party.participants.length}/{party.maxParticipants} joined
                    </span>
                    {user && (
                      <button
                        onClick={() => joinParty(party.id)}
                        disabled={
                          party.participants.includes(user.id) ||
                          party.participants.length >= party.maxParticipants
                        }
                        className="btn-primary py-1 px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {party.participants.includes(user.id)
                          ? 'Joined ✓'
                          : party.participants.length >= party.maxParticipants
                          ? 'Full'
                          : 'Join Party'
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming watch parties</h3>
            <p className="text-gray-600">
              {user
                ? 'Be the first to create a watch party!'
                : 'Sign up to create and join watch parties.'
              }
            </p>
          </div>
        )}
      </section>

      {/* Past Watch Parties */}
      {pastParties.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Watch Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastParties.slice(0, 6).map((party) => (
              <div key={party.id} className="card opacity-75">
                <div className="flex items-center space-x-4 p-4 border-b">
                  <img
                    src={getMoviePoster(party.movieId)}
                    alt={getMovieTitle(party.movieId)}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{party.title}</h3>
                    <p className="text-gray-600 text-sm">{getMovieTitle(party.movieId)}</p>
                    <span className="text-xs text-red-600 font-medium">Completed</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Hosted by {party.hostUsername}</div>
                    <div>{formatDate(party.scheduledFor)}</div>
                    <div>{party.participants.length} participants</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default WatchParties;
