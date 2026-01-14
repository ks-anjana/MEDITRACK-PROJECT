import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName } from '../utils/auth';

const Welcome = () => {
  const navigate = useNavigate();
  const userName = getUserName();

  // Auto-redirect after 3 seconds (optional)
  useEffect(() => {
    // Optional: Auto-redirect can be added here if needed
    // const timer = setTimeout(() => {
    //   navigate('/user-dashboard');
    // }, 3000);
    // return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    window.location.href = '/user-dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        {/* Welcome Icon */}
        <div className="mb-8 animate-bounce-slow">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full shadow-2xl">
            <span className="text-6xl">💊</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
            Thanks for choosing MediTrack
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-cyan-300 animate-slide-up-delayed">
            Welcome, {userName}!
          </h2>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-delayed"
        >
          Continue to Dashboard
        </button>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-4 animate-fade-in-delayed">
          <div className="text-4xl animate-float">💊</div>
          <div className="text-4xl animate-float-delayed">🏥</div>
          <div className="text-4xl animate-float">💉</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
