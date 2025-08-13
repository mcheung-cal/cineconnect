const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (replace with database in production)
let users = [
  {
    id: '1',
    username: 'moviebuff123',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    favoriteGenres: ['Action', 'Sci-Fi'],
    joinedCommunities: ['marvel-movies', 'scifi-classics']
  },
  {
    id: '2',
    username: 'cinephile_sarah',
    email: 'sarah@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    favoriteGenres: ['Drama', 'Horror'],
    joinedCommunities: ['horror-fans', 'indie-films']
  }
];

let movies = [
  {
    id: '1',
    title: 'The Avengers',
    year: 2012,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Joss Whedon',
    rating: 8.0,
    poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team.',
    streamingPlatforms: ['Disney+', 'Amazon Prime']
  },
  {
    id: '2',
    title: 'Inception',
    year: 2010,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'Christopher Nolan',
    rating: 8.8,
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    streamingPlatforms: ['Netflix', 'HBO Max']
  },
  {
    id: '3',
    title: 'The Shining',
    year: 1980,
    genre: ['Horror', 'Drama'],
    director: 'Stanley Kubrick',
    rating: 8.4,
    poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father.',
    streamingPlatforms: ['Amazon Prime', 'Hulu']
  },
  {
    id: '4',
    title: 'Blade Runner 2049',
    year: 2017,
    genre: ['Sci-Fi', 'Drama'],
    director: 'Denis Villeneuve',
    rating: 8.0,
    poster: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg',
    description: 'A young blade runner discovers a secret that leads him to track down former blade runner Rick Deckard.',
    streamingPlatforms: ['Netflix', 'Amazon Prime']
  }
];

let communities = [
  {
    id: 'marvel-movies',
    name: 'Marvel Movies',
    description: 'Discuss all things Marvel Cinematic Universe',
    memberCount: 15420,
    createdBy: '1',
    relatedMovies: ['1'],
    banner: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'scifi-classics',
    name: 'Sci-Fi Classics',
    description: 'For lovers of classic and modern science fiction films',
    memberCount: 8930,
    createdBy: '2',
    relatedMovies: ['2', '4'],
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'horror-fans',
    name: 'Horror Fans',
    description: 'Share your favorite scares and horror movie discussions',
    memberCount: 12750,
    createdBy: '2',
    relatedMovies: ['3'],
    banner: 'https://images.unsplash.com/photo-1520637836862-4d197d17c7a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

let posts = [
  {
    id: '1',
    title: 'Just rewatched Avengers for the 10th time!',
    content: 'Still gives me chills every time. The way they brought all the heroes together was masterful.',
    author: '1',
    authorUsername: 'moviebuff123',
    communityId: 'marvel-movies',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 45,
    downvotes: 2,
    commentCount: 8
  },
  {
    id: '2',
    title: 'Inception vs Blade Runner 2049 - Which has better cinematography?',
    content: 'Both films are visual masterpieces, but I lean towards Blade Runner 2049 for its stunning use of color and lighting.',
    author: '2',
    authorUsername: 'cinephile_sarah',
    communityId: 'scifi-classics',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    upvotes: 23,
    downvotes: 1,
    commentCount: 12
  },
  {
    id: '3',
    title: 'The Shining: Kubrick\'s Hidden Details',
    content: 'Found some amazing hidden details in my latest rewatch. The carpet patterns, the impossible window - everything has meaning!',
    author: '2',
    authorUsername: 'cinephile_sarah',
    communityId: 'horror-fans',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    upvotes: 67,
    downvotes: 3,
    commentCount: 15
  }
];

let comments = [
  {
    id: '1',
    postId: '1',
    content: 'Totally agree! The character development throughout the MCU leading up to this moment was perfect.',
    author: '2',
    authorUsername: 'cinephile_sarah',
    createdAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    upvotes: 12,
    downvotes: 0
  },
  {
    id: '2',
    postId: '2',
    content: 'I have to go with Inception. The rotating hallway scene alone is cinematographic genius.',
    author: '1',
    authorUsername: 'moviebuff123',
    createdAt: new Date(Date.now() - 172800000 + 7200000).toISOString(),
    upvotes: 8,
    downvotes: 2
  }
];

let watchParties = [
  {
    id: '1',
    title: 'Marvel Movie Marathon',
    movieId: '1',
    hostId: '1',
    hostUsername: 'moviebuff123',
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    platform: 'Disney+',
    participants: ['1', '2'],
    maxParticipants: 10,
    description: 'Let\'s watch the Avengers together and chat about our favorite moments!'
  },
  {
    id: '2',
    title: 'Horror Night: The Shining',
    movieId: '3',
    hostId: '2',
    hostUsername: 'cinephile_sarah',
    scheduledFor: new Date(Date.now() + 172800000).toISOString(),
    platform: 'Amazon Prime',
    participants: ['2'],
    maxParticipants: 6,
    description: 'Scary movie night! Come prepared for some spine-chilling discussions.'
  }
];

// Quiz questions for movie recommendations
const quizQuestions = [
  {
    id: 1,
    question: "What's your preferred movie genre?",
    options: [
      { value: 'action', label: 'Action' },
      { value: 'comedy', label: 'Comedy' },
      { value: 'drama', label: 'Drama' },
      { value: 'horror', label: 'Horror' },
      { value: 'scifi', label: 'Sci-Fi' },
      { value: 'romance', label: 'Romance' }
    ]
  },
  {
    id: 2,
    question: "What mood are you in?",
    options: [
      { value: 'adventurous', label: 'Adventurous' },
      { value: 'thoughtful', label: 'Thoughtful' },
      { value: 'scared', label: 'Want to be scared' },
      { value: 'laugh', label: 'Want to laugh' },
      { value: 'cry', label: 'Ready for emotions' }
    ]
  },
  {
    id: 3,
    question: "How much time do you have?",
    options: [
      { value: 'short', label: 'Less than 90 minutes' },
      { value: 'medium', label: '90-120 minutes' },
      { value: 'long', label: 'Over 2 hours' },
      { value: 'any', label: 'No preference' }
    ]
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      favoriteGenres: [],
      joinedCommunities: []
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Movie routes
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
});

// Quiz routes
app.get('/api/quiz/questions', (req, res) => {
  res.json(quizQuestions);
});

app.post('/api/quiz/recommendations', (req, res) => {
  const { answers } = req.body;
  
  // Simple recommendation logic based on answers
  let recommendedMovies = [...movies];
  
  // Filter by genre preference
  if (answers.genre) {
    const genreMap = {
      'action': ['Action'],
      'comedy': ['Comedy'],
      'drama': ['Drama'],
      'horror': ['Horror'],
      'scifi': ['Sci-Fi'],
      'romance': ['Romance']
    };
    
    if (genreMap[answers.genre]) {
      recommendedMovies = recommendedMovies.filter(movie => 
        movie.genre.some(g => genreMap[answers.genre].includes(g))
      );
    }
  }
  
  // If no movies match, return all movies
  if (recommendedMovies.length === 0) {
    recommendedMovies = movies;
  }
  
  // Return top 3 recommendations
  res.json(recommendedMovies.slice(0, 3));
});

// Community routes
app.get('/api/communities', (req, res) => {
  res.json(communities);
});

app.get('/api/communities/:id', (req, res) => {
  const community = communities.find(c => c.id === req.params.id);
  if (!community) {
    return res.status(404).json({ message: 'Community not found' });
  }
  res.json(community);
});

app.post('/api/communities/:id/join', authenticateToken, (req, res) => {
  const community = communities.find(c => c.id === req.params.id);
  if (!community) {
    return res.status(404).json({ message: 'Community not found' });
  }
  
  const user = users.find(u => u.id === req.user.userId);
  if (!user.joinedCommunities.includes(req.params.id)) {
    user.joinedCommunities.push(req.params.id);
    community.memberCount++;
  }
  
  res.json({ message: 'Joined community successfully' });
});

// Posts routes
app.get('/api/communities/:id/posts', (req, res) => {
  const communityPosts = posts.filter(p => p.communityId === req.params.id);
  res.json(communityPosts);
});

app.post('/api/communities/:id/posts', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  
  const newPost = {
    id: uuidv4(),
    title,
    content,
    author: req.user.userId,
    authorUsername: user.username,
    communityId: req.params.id,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.get('/api/posts/:id/comments', (req, res) => {
  const postComments = comments.filter(c => c.postId === req.params.id);
  res.json(postComments);
});

app.post('/api/posts/:id/comments', authenticateToken, (req, res) => {
  const { content } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  
  const newComment = {
    id: uuidv4(),
    postId: req.params.id,
    content,
    author: req.user.userId,
    authorUsername: user.username,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0
  };
  
  comments.push(newComment);
  
  // Update comment count
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    post.commentCount++;
  }
  
  res.status(201).json(newComment);
});

// Watch party routes
app.get('/api/watch-parties', (req, res) => {
  res.json(watchParties);
});

app.post('/api/watch-parties', authenticateToken, (req, res) => {
  const { title, movieId, scheduledFor, platform, maxParticipants, description } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  
  const newWatchParty = {
    id: uuidv4(),
    title,
    movieId,
    hostId: req.user.userId,
    hostUsername: user.username,
    scheduledFor,
    platform,
    participants: [req.user.userId],
    maxParticipants,
    description
  };
  
  watchParties.push(newWatchParty);
  res.status(201).json(newWatchParty);
});

app.post('/api/watch-parties/:id/join', authenticateToken, (req, res) => {
  const watchParty = watchParties.find(wp => wp.id === req.params.id);
  if (!watchParty) {
    return res.status(404).json({ message: 'Watch party not found' });
  }
  
  if (watchParty.participants.length >= watchParty.maxParticipants) {
    return res.status(400).json({ message: 'Watch party is full' });
  }
  
  if (!watchParty.participants.includes(req.user.userId)) {
    watchParty.participants.push(req.user.userId);
  }
  
  res.json({ message: 'Joined watch party successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
