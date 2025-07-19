import React, { useRef, useEffect, useState } from 'react';
import { Camera, RotateCcw, Check, X, HelpCircle, Lightbulb } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  faceNumber: number;
  isValidating: boolean;
  totalFaces: number;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  faceNumber,
  isValidating,
  totalFaces
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment' // Use back camera if available
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  };

  const tips = [
    "Make sure all 9 colored squares are clearly visible",
    "Use good lighting - avoid shadows on the cube",
    "Hold the cube steady with both hands",
    "Keep the cube face parallel to your camera",
    "If validation fails, try adjusting the lighting or angle"
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Capture Face {faceNumber} of {totalFaces}
          </h2>
          <p className="text-gray-600">
            Position this face within the grid overlay below
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
          </div>
          
          {showTips && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Photography Tips:</span>
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-80 object-cover"
          />
          
          {/* Grid overlay for alignment */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="w-48 h-48 border-4 border-white opacity-80 rounded-lg">
                <div className="text-white text-center mt-2 text-sm font-medium opacity-90">
                  Position cube face here
                </div>
                <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white opacity-50" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-white text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                <p>Starting camera...</p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          
          <button
            onClick={captureImage}
            disabled={!isReady || isValidating}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {isValidating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking Photo...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Take Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};