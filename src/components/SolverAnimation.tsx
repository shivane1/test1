import React, { useState, useEffect } from 'react';
import { SolveStep } from '../types/cube';
import { Play, Pause, SkipForward, SkipBack, RotateCw, Hand, HelpCircle, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SolverAnimationProps {
  steps: SolveStep[];
  onStepChange: (step: number) => void;
}

export const SolverAnimation: React.FC<SolverAnimationProps> = ({ steps, onStepChange }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds per step
  const [showHandGuide, setShowHandGuide] = useState(true);

  const startAnimation = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      onStepChange(0);
    }
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          onStepChange(next);
          return next;
        });
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed, onStepChange]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onStepChange(next);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onStepChange(prev);
    }
  };

  const currentStepData = steps[currentStep];
  
  if (!currentStepData) return null;

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Solution Guide</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Follow these steps to solve your cube</p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Clock className="w-4 h-4" />
            ~{Math.ceil((steps.length - currentStep) * (speed / 1000))}s remaining
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-6`}>
        <div
          className={`${isDark ? 'bg-blue-500' : 'bg-blue-500'} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Current step display */}
      <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-lg">
            {currentStepData.notation}
          </div>
          <div>
            <h3 className={`font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {currentStepData.description}
            </h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Rotate {currentStepData.face} face {currentStepData.direction}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowHandGuide(!showHandGuide)}
            className={`flex items-center gap-2 font-medium transition-colors ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Hand className="w-5 h-5" />
            {showHandGuide ? 'Hide' : 'Show'} Hand Guide
          </button>
        </div>

        {/* Hand gesture guidance */}
        {showHandGuide && (
          <div className={`${isDark ? 'bg-gray-600 border-blue-500' : 'bg-white border-blue-200'} rounded-lg p-5 border-2 shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <Hand className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h4 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>How to Move Your Hands</h4>
            </div>
            <p className={`mb-4 text-base leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {currentStepData.handGesture.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Use these fingers:</span>
                <div className="flex gap-1">
                  {currentStepData.handGesture.fingers.map((finger, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark 
                          ? 'bg-blue-600 text-blue-100' 
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {finger}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCw className={`w-5 h-5 ${
                  currentStepData.direction === 'clockwise' ? 'text-green-600' : 'text-orange-600 transform scale-x-[-1]'
                }`} />
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Direction: <span className={isDark ? 'text-white' : 'text-gray-800'}>{currentStepData.direction}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handleStepBack}
          disabled={currentStep === 0}
          className={`p-4 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg ${
            isDark 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={isPlaying ? pauseAnimation : startAnimation}
          className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={handleStepForward}
          disabled={currentStep === steps.length - 1}
          className={`p-4 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg ${
            isDark 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Speed control */}
      <div className={`flex items-center justify-center gap-4 rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Animation Speed:</span>
        <input
          type="range"
          min="500"
          max="3000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className={`w-40 ${isDark ? 'accent-blue-500' : 'accent-blue-600'}`}
        />
        <span className={`text-sm font-medium min-w-[3rem] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {(speed / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
};