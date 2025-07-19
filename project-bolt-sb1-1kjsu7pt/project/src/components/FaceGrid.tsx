import React from 'react';
import { CubeFace } from '../types/cube';
import { Camera, Check, X, RotateCcw, AlertTriangle, Upload, ChevronDown } from 'lucide-react';

interface FaceGridProps {
  faces: CubeFace[];
  onCaptureFace: (faceId: number) => void;
  onUploadFace: (faceId: number) => void;
  currentCapturing: number | null;
}

export const FaceGrid: React.FC<FaceGridProps> = ({
  faces,
  onCaptureFace,
  onUploadFace,
  currentCapturing
}) => {
  const [expandedFace, setExpandedFace] = React.useState<number | null>(null);

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      white: 'bg-white border-gray-300',
      red: 'bg-red-500',
      blue: 'bg-blue-500', 
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-400'
    };
    return colorMap[color] || 'bg-gray-200';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {faces.map((face) => (
        <div
          key={face.id}
          className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">{face.name}</h3>
            <div className="flex items-center gap-2">
              {face.validated ? (
                <div className="flex items-center gap-1">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Valid</span>
                </div>
              ) : face.captured ? (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">Retry</span>
                </div>
              ) : null}
            </div>
          </div>

          {face.captured && face.colors ? (
            <div className="grid grid-cols-3 gap-1 mb-3">
              {face.colors.map((row, rowIndex) =>
                row.map((color, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square rounded border-2 ${getColorClass(color)}`}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs text-gray-500">Not captured</span>
              </div>
            </div>
          )}

          {face.validated ? (
            <button
              className="w-full py-2 px-4 rounded-lg font-medium bg-green-100 text-green-700 cursor-default border-2 border-green-200"
            >
              ✓ Perfect!
            </button>
          ) : (
            <div className="space-y-2">
              {expandedFace === face.id ? (
                <>
                  <button
                    onClick={() => onCaptureFace(face.id)}
                    disabled={currentCapturing !== null}
                    className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentCapturing === face.id ? (
                      'Capturing...'
                    ) : (
                      <>
                        <Camera className="w-4 h-4 inline mr-2" />
                        Take Photo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onUploadFace(face.id)}
                    disabled={currentCapturing !== null}
                    className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-purple-500 text-white hover:bg-purple-600 border-2 border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setExpandedFace(null)}
                    className="w-full py-1 px-4 rounded-lg font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setExpandedFace(face.id)}
                  disabled={currentCapturing !== null}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    face.captured
                      ? 'bg-orange-500 text-white hover:bg-orange-600 border-2 border-orange-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {face.captured ? '📷 Retake Photo' : '📷 Add Photo'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};