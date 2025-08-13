import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Movie, Community, WatchParty } from '../types';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedCommunities, setRelatedCommunities] = useState<Community[]>([]);
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        const [movieRes, communitiesRes, watchPartiesRes] = await Promise.all([
          axios.get(`/api/movies/${id}`),
          axios.get('/api/communities'),
          axios.get('/api/watch-parties')
        ]);

        setMovie(movieRes.data);
        
        // Filter communities related to this movie
        const related = communitiesRes.data.filter((community: Community) =>
          community.relatedMovies.includes(id)
        );
        setRelatedCommunities(related);

        // Filter watch parties for this movie
        const parties = watchPartiesRes.data.filter((party: WatchParty) =>
          party.movieId === id
        );
        setWatchParties(parties);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Movie not found</h1>
          <Link to="/movies" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/movies"
        className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center"
      >
        ← Back to Movies
      </Link>

      {/* Movie Header */}
      <div className="card mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-96 md:h-auto object-cover rounded-l-xl"
            />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{movie.title}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-gray-600 font-medium">Year:</span>
                <span className="ml-2">{movie.year}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Director:</span>
                <span className="ml-2">{movie.director}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Rating:</span>
                <span className="ml-2 text-yellow-500 font-medium">⭐ {movie.rating}/10</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Genres:</span>
                <span className="ml-2">{movie.genre.join(', ')}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plot</h3>
              <p className="text-gray-700 leading-relaxed">{movie.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Available On</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streamingPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Related Communities */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Communities</h2>
          {relatedCommunities.length > 0 ? (
            <div className="space-y-4">
              {relatedCommunities.map((community) => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="card p-4 hover:shadow-lg transition-shadow duration-300 block"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={community.banner}
                      alt={community.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{community.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{community.description}</p>
                      <span className="text-primary-600 text-sm font-medium">
                        👥 {community.memberCount.toLocaleString()} members
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No communities yet</h3>
              <p className="text-gray-600">
                Be the first to create a community for this movie!
              </p>
            </div>
          )}
        </div>

        {/* Watch Parties */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Watch Parties</h2>
            <Link to="/watch-parties" className="btn-primary">
              Create Party
            </Link>
          </div>
          
          {watchParties.length > 0 ? (
            <div className="space-y-4">
              {watchParties.map((party) => (
                <div key={party.id} className="card p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{party.title}</h3>
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
                      <span className="font-medium">Scheduled:</span>
                      <span className="ml-2">{formatDate(party.scheduledFor)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {party.participants.length}/{party.maxParticipants} joined
                    </span>
                    <button className="btn-primary py-1 px-3 text-sm">
                      Join Party
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No watch parties yet</h3>
              <p className="text-gray-600 mb-4">
                Start a watch party to enjoy this movie with others!
              </p>
              <Link to="/watch-parties" className="btn-primary">
                Create Watch Party
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
