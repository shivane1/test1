import React, { useState } from 'react';
import { Hand, RotateCw, Eye, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SolveStep } from '../types/cube';
import { useTheme } from '../contexts/ThemeContext';

interface HandGestureGuideProps {
  step: SolveStep;
  isExpanded: boolean;
  onToggle: () => void;
}

export const HandGestureGuide: React.FC<HandGestureGuideProps> = ({ 
  step, 
  isExpanded, 
  onToggle 
}) => {
  const { isDark } = useTheme();

  const getHandAnimation = (notation: string) => {
    const isCounterclockwise = notation.includes("'");
    return isCounterclockwise ? 'animate-spin-reverse' : 'animate-spin-slow';
  };

  const getFingerPositions = (notation: string) => {
    const face = notation.replace(/['2]/g, '');
    const positions = {
      'F': { thumb: 'bottom-left', index: 'top-right', middle: 'center' },
      'R': { thumb: 'right', index: 'top' },
      'U': { index: 'top-left', middle: 'top-right' },
      'L': { thumb: 'left', index: 'top' },
      'B': { thumb: 'back', middle: 'center', ring: 'back-right' },
      'D': { thumb: 'bottom', index: 'bottom-left', middle: 'bottom-right' }
    };
    return positions[face as keyof typeof positions] || positions['F'];
  };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg overflow-hidden transition-all duration-300`}>
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
            <Hand className={`w-5 h-5 ${isDark ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Hand Gesture Guide
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {step.notation} - {step.face} face {step.direction}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {isExpanded && (
        <div className={`p-6 border-t ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* 3D Hand Visualization */}
            <div className="space-y-4">
              <h4 className={`font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <Eye className="w-4 h-4" />
                Hand Position
              </h4>
              
              <div className={`relative w-full h-48 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center overflow-hidden`}>
                {/* Animated Hand Representation */}
                <div className="relative">
                  <div className={`w-20 h-20 ${isDark ? 'bg-blue-600' : 'bg-blue-500'} rounded-lg ${getHandAnimation(step.notation)} shadow-lg`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{step.notation}</span>
                    </div>
                  </div>
                  
                  {/* Finger indicators */}
                  {step.handGesture.fingers.map((finger, index) => (
                    <div
                      key={finger}
                      className={`absolute w-3 h-3 ${isDark ? 'bg-yellow-400' : 'bg-yellow-500'} rounded-full animate-pulse`}
                      style={{
                        top: `${20 + index * 15}%`,
                        left: `${30 + index * 20}%`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Direction arrow */}
                <div className="absolute bottom-4 right-4">
                  <RotateCw 
                    className={`w-6 h-6 ${
                      step.direction === 'clockwise' 
                        ? 'text-green-500' 
                        : 'text-orange-500 transform scale-x-[-1]'
                    } ${getHandAnimation(step.notation)}`} 
                  />
                </div>
              </div>
            </div>

            {/* Detailed Instructions */}
            <div className="space-y-4">
              <h4 className={`font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <HelpCircle className="w-4 h-4" />
                Step-by-Step
              </h4>
              
              <div className="space-y-3">
                <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                    1. Hand Placement
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-blue-700'}`}>
                    {step.handGesture.description}
                  </p>
                </div>
                
                <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-800'} mb-2`}>
                    2. Finger Usage
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.handGesture.fingers.map((finger) => (
                      <span
                        key={finger}
                        className={`px-2 py-1 ${isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'} rounded-full text-xs font-medium capitalize`}
                      >
                        {finger}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-orange-50'} rounded-lg`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-800'} mb-2`}>
                    3. Rotation Direction
                  </p>
                  <div className="flex items-center gap-2">
                    <RotateCw 
                      className={`w-4 h-4 ${
                        step.direction === 'clockwise' 
                          ? 'text-green-500' 
                          : 'text-orange-500 transform scale-x-[-1]'
                      }`} 
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-orange-700'} capitalize`}>
                      {step.direction}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};