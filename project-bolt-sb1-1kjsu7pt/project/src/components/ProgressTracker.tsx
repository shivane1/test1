import React from 'react';
import { CheckCircle, Circle, Camera, AlertTriangle } from 'lucide-react';

interface ProgressTrackerProps {
  faces: Array<{
    id: number;
    name: string;
    captured: boolean;
    validated: boolean;
  }>;
  currentCapturing: number | null;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  faces,
  currentCapturing
}) => {
  const getStatusIcon = (face: any) => {
    if (currentCapturing === face.id) {
      return <Camera className="w-5 h-5 text-blue-600 animate-pulse" />;
    }
    if (face.validated) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (face.captured && !face.validated) {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = (face: any) => {
    if (currentCapturing === face.id) return 'Capturing...';
    if (face.validated) return 'Validated ✓';
    if (face.captured && !face.validated) return 'Needs retake';
    return 'Not captured';
  };

  const getStatusColor = (face: any) => {
    if (currentCapturing === face.id) return 'text-blue-600 bg-blue-50';
    if (face.validated) return 'text-green-600 bg-green-50';
    if (face.captured && !face.validated) return 'text-orange-600 bg-orange-50';
    return 'text-gray-500 bg-gray-50';
  };

  const validatedCount = faces.filter(f => f.validated).length;
  const capturedCount = faces.filter(f => f.captured).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Capture Progress</h3>
        <div className="text-sm text-gray-600">
          {validatedCount}/6 faces ready
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((validatedCount / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(validatedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Individual face status */}
      <div className="space-y-3">
        {faces.map((face, index) => (
          <div
            key={face.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              currentCapturing === face.id
                ? 'border-blue-300 bg-blue-50'
                : face.validated
                ? 'border-green-200 bg-green-50'
                : face.captured
                ? 'border-orange-200 bg-orange-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(face)}
              <div>
                <div className="font-medium text-gray-800">
                  Face {face.id}
                </div>
                <div className={`text-sm ${getStatusColor(face).split(' ')[0]}`}>
                  {getStatusText(face)}
                </div>
              </div>
            </div>
            
            {currentCapturing === face.id && (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        ))}
      </div>

      {validatedCount === 6 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">All faces captured successfully!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Ready to solve your cube. Click the "Solve Cube" button to continue.
          </p>
        </div>
      )}
    </div>
  );
};