export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  favoriteGenres?: string[];
  joinedCommunities?: string[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  rating: number;
  poster: string;
  description: string;
  streamingPlatforms: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdBy: string;
  relatedMovies: string[];
  banner: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUsername: string;
  communityId: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorUsername: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export interface WatchParty {
  id: string;
  title: string;
  movieId: string;
  hostId: string;
  hostUsername: string;
  scheduledFor: string;
  platform: string;
  participants: string[];
  maxParticipants: number;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface QuizAnswers {
  [key: string]: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
