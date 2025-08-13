# CineConnect - Movie Social Platform

A social media platform that combines the best features of Letterboxd, Reddit, and movie watch party sites. Users can get personalized movie recommendations through a quiz, join communities to discuss movies and TV shows, and participate in shared watching experiences.

## 🎬 Features

### Core Features
- **Movie Recommendation Quiz** - Answer questions to get personalized movie suggestions
- **Movie Communities** - Join Reddit-style communities for specific movies/genres
- **Watch Parties** - Create and join synchronized viewing sessions
- **Social Features** - Post discussions, comment, and interact with other users
- **Movie Database** - Browse and discover movies with filtering and search

### Key Components
- **Authentication System** - User registration and login
- **Community Discussions** - Create posts and comments in movie communities
- **Movie Discovery** - Search, filter, and explore movie catalog
- **Watch Party Management** - Schedule and join viewing sessions
- **Responsive Design** - Modern UI with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd movie-social-app
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (http://localhost:5000) and frontend (http://localhost:3000).

### Alternative Manual Setup

If the above doesn't work, you can start each service manually:

1. **Start the backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🎯 Demo Usage

### Try the Demo Accounts

The app comes with pre-populated dummy data and demo accounts:

**Demo User 1:**
- Email: `john@example.com`
- Password: `password`

**Demo User 2:**
- Email: `sarah@example.com`
- Password: `password`

### Explore Features

1. **Take the Quiz** - Get movie recommendations based on your preferences
2. **Browse Movies** - Explore the movie database with search and filters
3. **Join Communities** - Participate in discussions about your favorite films
4. **Create Watch Parties** - Schedule viewing sessions with other users
5. **Make Posts** - Share your thoughts in movie communities

## 🏗️ Project Structure

```
movie-social-app/
├── server/                 # Express.js backend
│   ├── package.json
│   └── index.js           # Main server file with API routes
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── types/         # TypeScript interfaces
│   │   └── index.css      # Tailwind CSS styles
│   └── package.json
├── package.json           # Root package.json for scripts
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **In-memory data storage** (for demo purposes)

## 📱 Core Features Explained

### Movie Recommendation Quiz
- Multi-step questionnaire about preferences
- Algorithm-based movie suggestions
- Integration with movie database

### Communities (Reddit-style)
- Movie/genre-specific discussion groups
- Post creation and commenting system
- User engagement features (join/leave)

### Watch Parties
- Schedule synchronized viewing sessions
- Multi-platform streaming support
- Participant management and chat

### Movie Database
- Comprehensive movie information
- Search and filtering capabilities
- Integration with communities and watch parties

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop and mobile
- **Modern Interface** - Clean, intuitive design
- **Loading States** - Proper feedback for user actions
- **Error Handling** - Graceful error messaging
- **Demo Data** - Pre-populated content for exploration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get specific movie

### Quiz
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/recommendations` - Get recommendations

### Communities
- `GET /api/communities` - Get all communities
- `GET /api/communities/:id` - Get specific community
- `POST /api/communities/:id/join` - Join community
- `GET /api/communities/:id/posts` - Get community posts
- `POST /api/communities/:id/posts` - Create post

### Watch Parties
- `GET /api/watch-parties` - Get all watch parties
- `POST /api/watch-parties` - Create watch party
- `POST /api/watch-parties/:id/join` - Join watch party

## 🚧 Development Notes

This is a **barebones demo version** with the following limitations:

- **In-memory storage** - Data resets on server restart
- **Basic authentication** - No advanced security features
- **Dummy data** - Pre-populated with sample content
- **No real streaming integration** - Watch parties are conceptual
- **Limited error handling** - Basic error responses

### Production Considerations

For a production version, consider:
- Database integration (PostgreSQL, MongoDB)
- Real-time features (WebSockets for watch parties)
- Video streaming integration
- Advanced security measures
- Image upload and storage
- Email notifications
- Mobile app development

## 🤝 Contributing

This is a demo project, but if you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this code for your own projects!

---

**Enjoy exploring CineConnect!** 🍿🎬
