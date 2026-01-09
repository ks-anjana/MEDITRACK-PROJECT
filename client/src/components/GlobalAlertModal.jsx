import React, { useEffect, useRef } from 'react';

/**
 * Global Alert Modal - Shows medicine and appointment alerts
 * with sound notification
 */
const GlobalAlertModal = ({ alerts, onClose }) => {
  const audioRef = useRef(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (alerts && alerts.length > 0 && !hasPlayedSound.current) {
      console.log('🔊 [ALERT] Playing sound...');
      // Play alert sound with user interaction fallback
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn('⚠️ [ALERT] Could not auto-play sound (may need user interaction):', err.message);
          // Try again on click
          const playOnClick = () => {
            audioRef.current?.play().catch(() => {});
            document.removeEventListener('click', playOnClick);
          };
          document.addEventListener('click', playOnClick);
        });
      }
      hasPlayedSound.current = true;
    }

    // Reset sound flag when alerts are dismissed
    if (!alerts || alerts.length === 0) {
      hasPlayedSound.current = false;
    }
  }, [alerts]);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  console.log('🖥️ [ALERT] Rendering modal with', alerts.length, 'alert(s)');

  return (
    <>
      {/* Audio element for alert sound */}
      <audio ref={audioRef} preload="auto" autoPlay>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQpGn9/yvmwhBTKG0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQpFn9/yvmwhBTKG0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQpFn9/yvmwhBTKG0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQpFn9/yvmwhBTKG0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQpFn9/yvmwhBTKG0fPTgjMGHm7A7+OZRQ0PVqzn7KlZEQ==" type="audio/wav" />
      </audio>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
        {/* Modal Container */}
        <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-slideIn border border-cyan-600">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl animate-bounce">🔔</span>
                <h2 className="text-xl font-bold">Alert!</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Alert Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {alerts.map((alert, index) => (
              <div
                key={alert.key || index}
                className={`${
                  index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''
                }`}
              >
                {alert.type === 'medicine' ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center border border-green-600">
                        <span className="text-2xl">💊</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Time to take your medicine!
                        </h3>
                        <div className="space-y-2 text-gray-300">
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">💊 Medicine:</span>
                            <span className="text-base text-white">{alert.medicineName}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">🍽️ Instructions:</span>
                            <span className="capitalize text-white">{alert.foodTiming}</span>
                          </p>
                          <p className="flex items-center text-sm text-gray-400">
                            <span className="mr-2">⏰</span>
                            <span className="text-white">{alert.time}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-600">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Appointment Reminder!
                        </h3>
                        <div className="space-y-2 text-gray-300">
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">👨‍⚕️ Doctor:</span>
                            <span className="text-base text-white">Dr. {alert.doctorName}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">🏥 Hospital:</span>
                            <span className="text-white">{alert.hospitalName}</span>
                          </p>
                          <p className="flex items-center text-sm text-gray-400">
                            <span className="mr-2">⏰</span>
                            <span className="text-white">{alert.time}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-900 rounded-b-xl border-t border-slate-700">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default GlobalAlertModal;
