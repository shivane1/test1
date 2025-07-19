import React from 'react';
import { Camera, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface CaptureInstructionsProps {
  currentFace: number;
  totalFaces: number;
  isCapturing: boolean;
}

export const CaptureInstructions: React.FC<CaptureInstructionsProps> = ({
  currentFace,
  totalFaces,
  isCapturing
}) => {
  const faceNames = [
    'Front Face (any color)',
    'Back Face', 
    'Right Face',
    'Left Face',
    'Top Face',
    'Bottom Face'
  ];

  const instructions = [
    "Hold the cube with any face toward the camera. This will be your reference point.",
    "Rotate the cube 180° to show the opposite face.",
    "From the front position, rotate the cube 90° to the right.",
    "From the front position, rotate the cube 90° to the left.", 
    "From the front position, rotate the cube so the top face is toward the camera.",
    "From the front position, rotate the cube so the bottom face is toward the camera."
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
          {currentFace}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {faceNames[currentFace - 1]}
          </h3>
          <p className="text-sm text-gray-600">
            Face {currentFace} of {totalFaces}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          How to position your cube:
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {instructions[currentFace - 1]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span>All 9 squares visible</span>
        </div>
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span>Good lighting</span>
        </div>
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span>Steady hands</span>
        </div>
      </div>

      {isCapturing && (
        <div className="mt-4 flex items-center gap-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Taking photo...</span>
        </div>
      )}
    </div>
  );
};