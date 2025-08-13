import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { QuizQuestion, Movie, QuizAnswers } from '../types';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/quiz/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (questionId: number, value: string) => {
    const questionKey = questions[questionId - 1]?.question.toLowerCase().includes('genre') ? 'genre' :
                       questions[questionId - 1]?.question.toLowerCase().includes('mood') ? 'mood' :
                       questions[questionId - 1]?.question.toLowerCase().includes('time') ? 'time' : 'other';
    
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/quiz/recommendations', { answers });
      setRecommendations(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setShowResults(false);
  };

  const getCurrentQuestionKey = () => {
    const question = questions[currentQuestion];
    if (!question) return 'other';
    
    return question.question.toLowerCase().includes('genre') ? 'genre' :
           question.question.toLowerCase().includes('mood') ? 'mood' :
           question.question.toLowerCase().includes('time') ? 'time' : 'other';
  };

  if (loading && !showResults) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Movie Recommendations</h1>
          <p className="text-xl text-gray-600">Based on your preferences, here are some movies you might enjoy:</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recommendations.map((movie) => (
                <Link key={movie.id} to={`/movies/${movie.id}`} className="card hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{movie.title}</h3>
                    <p className="text-gray-600 mb-2">{movie.year} • {movie.director}</p>
                    <p className="text-gray-700 text-sm mb-3">{movie.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 font-medium">⭐ {movie.rating}</span>
                      <span className="text-xs text-gray-500">{movie.genre.join(', ')}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Available on: {movie.streamingPlatforms.join(', ')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={resetQuiz}
                className="btn-secondary"
              >
                Take Quiz Again
              </button>
              <Link to="/movies" className="btn-primary">
                Browse All Movies
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Movie Recommendation Quiz</h1>
        <p className="text-xl text-gray-600">
          Answer a few questions to get personalized movie recommendations
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {currentQ && (
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors duration-200 ${
                  answers[getCurrentQuestionKey()] === option.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!answers[getCurrentQuestionKey()]}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'Get Recommendations' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
