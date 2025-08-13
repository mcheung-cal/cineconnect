import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Community as CommunityType, Post, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Community: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({});
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!id) return;
      
      try {
        const [communityRes, postsRes] = await Promise.all([
          axios.get(`/api/communities/${id}`),
          axios.get(`/api/communities/${id}/posts`)
        ]);

        setCommunity(communityRes.data);
        setPosts(postsRes.data);
        
        // Check if user has joined this community
        if (user) {
          setJoined(user.joinedCommunities?.includes(id) || false);
        }
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [id, user]);

  const joinCommunity = async () => {
    if (!token || !id) return;
    
    try {
      await axios.post(`/api/communities/${id}/join`);
      setJoined(true);
      if (community) {
        setCommunity({ ...community, memberCount: community.memberCount + 1 });
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    try {
      const response = await axios.post(`/api/communities/${id}/posts`, {
        title: newPostTitle,
        content: newPostContent
      });

      setPosts([response.data, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(prev => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const togglePostExpansion = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Load comments when expanding
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
    setExpandedPosts(newExpanded);
  };

  const handleAddComment = async (postId: string) => {
    if (!token || !newComments[postId]?.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComments[postId]
      });

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));

      // Update post comment count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      );

      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

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

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Community not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Community Header */}
      <div className="card mb-8">
        <img
          src={community.banner}
          alt={community.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.name}</h1>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👥 {community.memberCount.toLocaleString()} members</span>
              </div>
            </div>
            {user && (
              <button
                onClick={joinCommunity}
                disabled={joined}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  joined
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {joined ? 'Joined ✓' : 'Join Community'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      {user && joined && (
        <div className="card mb-8 p-6">
          {!showNewPost ? (
            <button
              onClick={() => setShowNewPost(true)}
              className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200"
            >
              <span className="text-gray-600">Share your thoughts about this community...</span>
            </button>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                className="input-field"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="What's on your mind?"
                className="input-field h-32 resize-none"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              />
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">
              {user && joined
                ? 'Be the first to start a discussion!'
                : 'Join the community to see and create posts.'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`}
                  alt={post.authorUsername}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{post.authorUsername}</span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => togglePostExpansion(post.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                    >
                      <span>💬</span>
                      <span>{post.commentCount} comments</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors duration-200">
                      <span>👍</span>
                      <span>{post.upvotes}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedPosts.has(post.id) && (
                    <div className="mt-6 border-t pt-4">
                      {/* Add Comment Form */}
                      {user && token && (
                        <div className="mb-4">
                          <div className="flex space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 flex space-x-2">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 input-field py-2"
                                value={newComments[post.id] || ''}
                                onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComments[post.id]?.trim()}
                                className="btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-3">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorUsername}`}
                              alt={comment.authorUsername}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.authorUsername}</span>
                                <span className="text-gray-500 text-xs">{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
