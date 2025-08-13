import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Community } from '../types';

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get('/api/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Movie Communities</h1>
        <p className="text-xl text-gray-600">
          Join communities to discuss your favorite movies and TV shows with fellow enthusiasts
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search communities..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Link
            key={community.id}
            to={`/communities/${community.id}`}
            className="card hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={community.banner}
              alt={community.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">{community.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{community.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-primary-600 font-medium">
                    👥 {community.memberCount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-primary-100 hover:bg-primary-200 text-primary-800 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200">
                  Join
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No communities found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No communities available at the moment'
            }
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-primary-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find the community you're looking for?</h2>
        <p className="text-gray-600 mb-6">
          Communities are created based on popular movies and shows. 
          Keep checking back as we add new communities regularly!
        </p>
        <Link to="/movies" className="btn-primary">
          Discover Movies
        </Link>
      </div>
    </div>
  );
};

export default Communities;
