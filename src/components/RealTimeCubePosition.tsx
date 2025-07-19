import React, { useState, useEffect } from 'react';
import { CubeFace, CubePosition } from '../types/cube';
import { RotateCw, Target, Compass } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface RealTimeCubePositionProps {
  faces: CubeFace[];
  currentStep: number;
  targetPosition: CubePosition;
  onPositionUpdate: (position: CubePosition) => void;
}

export const RealTimeCubePosition: React.FC<RealTimeCubePositionProps> = ({
  faces,
  currentStep,
  targetPosition,
  onPositionUpdate
}) => {
  const { isDark } = useTheme();
  const [currentPosition, setCurrentPosition] = useState<CubePosition>({
    x: 0, y: 0, z: 0,
    rotationX: -15, rotationY: 45, rotationZ: 0
  });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Simulate real-time position tracking
    if (isTracking) {
      const interval = setInterval(() => {
        setCurrentPosition(prev => {
          const newPosition = {
            ...prev,
            rotationY: prev.rotationY + (Math.random() - 0.5) * 2,
            rotationX: prev.rotationX + (Math.random() - 0.5) * 1
          };
          onPositionUpdate(newPosition);
          return newPosition;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isTracking, onPositionUpdate]);

  const getPositionAccuracy = () => {
    const diffX = Math.abs(currentPosition.rotationX - targetPosition.rotationX);
    const diffY = Math.abs(currentPosition.rotationY - targetPosition.rotationY);
    const totalDiff = diffX + diffY;
    return Math.max(0, 100 - totalDiff);
  };

  const accuracy = getPositionAccuracy();
  const isAligned = accuracy > 85;

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-600' : 'bg-purple-100'}`}>
            <Compass className={`w-5 h-5 ${isDark ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Real-Time Position
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Step {currentStep + 1} positioning
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isTracking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {/* Position Accuracy Meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Position Accuracy
          </span>
          <span className={`text-sm font-bold ${
            isAligned ? 'text-green-500' : accuracy > 50 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {Math.round(accuracy)}%
          </span>
        </div>
        
        <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isAligned ? 'bg-green-500' : accuracy > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        
        {isAligned && (
          <div className="flex items-center gap-2 mt-2 text-green-500">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Perfect alignment! Ready for next step.</span>
          </div>
        )}
      </div>

      {/* Position Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Current Position
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>X Rotation:</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {currentPosition.rotationX.toFixed(1)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Y Rotation:</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {currentPosition.rotationY.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>

        <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Target Position
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>X Rotation:</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {targetPosition.rotationX.toFixed(1)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Y Rotation:</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {targetPosition.rotationY.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Position Indicator */}
      <div className="mt-6">
        <div className={`relative w-full h-32 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg transition-transform duration-300"
              style={{
                transform: `perspective(200px) rotateX(${currentPosition.rotationX}deg) rotateY(${currentPosition.rotationY}deg)`
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <RotateCw className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Target indicator */}
          <div className="absolute top-2 right-2">
            <div
              className="w-8 h-8 border-2 border-green-500 border-dashed rounded opacity-50"
              style={{
                transform: `perspective(200px) rotateX(${targetPosition.rotationX}deg) rotateY(${targetPosition.rotationY}deg)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};