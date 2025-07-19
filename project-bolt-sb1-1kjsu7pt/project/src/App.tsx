import React, { useState, useCallback } from 'react';
import { CubeFace, CubeState, SolveStep } from './types/cube';
import { CubeValidator } from './utils/cubeValidator';
import { CubeSolver } from './utils/cubeSolver';
import { WelcomeGuide } from './components/WelcomeGuide';
import { CaptureInstructions } from './components/CaptureInstructions';
import { ProgressTracker } from './components/ProgressTracker';
import { CameraCapture } from './components/CameraCapture';
import { FaceGrid } from './components/FaceGrid';
import { Cube3D } from './components/Cube3D';
import { SolverAnimation } from './components/SolverAnimation';
import { PhotoUpload } from './components/PhotoUpload';
import { Cuboid as Cube, Camera, Zap, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

function App() {
  const [cubeState, setCubeState] = useState<CubeState>({
    faces: [
      { id: 1, name: 'Face 1', colors: [], captured: false, validated: false },
      { id: 2, name: 'Face 2', colors: [], captured: false, validated: false },
      { id: 3, name: 'Face 3', colors: [], captured: false, validated: false },
      { id: 4, name: 'Face 4', colors: [], captured: false, validated: false },
      { id: 5, name: 'Face 5', colors: [], captured: false, validated: false },
      { id: 6, name: 'Face 6', colors: [], captured: false, validated: false }
    ],
    isComplete: false,
    isSolved: false
  });

  const [currentCapturing, setCurrentCapturing] = useState<number | null>(null);
  const [currentUploading, setCurrentUploading] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [solveSteps, setSolveSteps] = useState<SolveStep[]>([]);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [showSolver, setShowSolver] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const handleCaptureFace = useCallback((faceId: number) => {
    setCurrentCapturing(faceId);
  }, []);

  const handleUploadFace = useCallback((faceId: number) => {
    setCurrentUploading(faceId);
  }, []);
  const handleCaptureComplete = useCallback(async (imageData: string) => {
    const faceId = currentCapturing || currentUploading;
    if (faceId === null) return;

    setIsValidating(true);
    
    try {
      const validation = await CubeValidator.validateFace(imageData);
      
      setCubeState(prev => {
        const newFaces = prev.faces.map(face => {
          if (face.id === faceId) {
            return {
              ...face,
              captured: true,
              validated: validation.isValid,
              colors: validation.colors || [],
              imageData
            };
          }
          return face;
        });

        const allValidated = newFaces.every(face => face.validated);
        const isComplete = allValidated && CubeValidator.validateCompleteCube(newFaces);

        return {
          faces: newFaces,
          isComplete,
          isSolved: false
        };
      });
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
      setCurrentCapturing(null);
      setCurrentUploading(null);
    }
  }, [currentCapturing, currentUploading]);

  const handleCancelCapture = useCallback(() => {
    setCurrentCapturing(null);
  }, []);

  const handleCancelUpload = useCallback(() => {
    setCurrentUploading(null);
  }, []);
  const handleSolveCube = useCallback(() => {
    if (!cubeState.isComplete) return;

    const steps = CubeSolver.solveCube(cubeState.faces);
    setSolveSteps(steps);
    setShowSolver(true);
    setCurrentAnimationStep(0);
  }, [cubeState]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentAnimationStep(step);
  }, []);

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    setHasStarted(true);
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
    setHasStarted(true);
  };

  const validatedCount = cubeState.faces.filter(face => face.validated).length;
  const capturedCount = cubeState.faces.filter(face => face.captured).length;
  const nextFaceToCapture = cubeState.faces.find(face => !face.captured)?.id || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cube className="w-8 h-8 text-blue-600" />
                {cubeState.isComplete && (
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Cube Solver
              </h1>
            </div>
            <div className="flex items-center gap-6">
              {showSolver && (
                <button
                  onClick={() => setShowSolver(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Capture
                </button>
              )}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {validatedCount}/6 faces ready
                </div>
                <div className="text-xs text-gray-500">
                  {cubeState.isComplete ? 'Ready to solve!' : `${6 - validatedCount} remaining`}
                </div>
              </div>
              {cubeState.isComplete && (
                <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showSolver ? (
          <>
            {/* Instructions for current face */}
            {hasStarted && nextFaceToCapture && (
              <CaptureInstructions
                currentFace={nextFaceToCapture}
                totalFaces={6}
                isCapturing={currentCapturing === nextFaceToCapture}
              />
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Progress tracker */}
              <div className="lg:col-span-1">
                <ProgressTracker
                  faces={cubeState.faces}
                  currentCapturing={currentCapturing}
                />
              </div>

            {/* Face capture grid */}
              <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Cube Faces
              </h2>
              <FaceGrid
                faces={cubeState.faces}
                onCaptureFace={handleCaptureFace}
                onUploadFace={handleUploadFace}
                currentCapturing={currentCapturing}
              />
              
              {cubeState.isComplete && (
                  <div className="mt-8 text-center">
                  <button
                    onClick={handleSolveCube}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl text-lg"
                  >
                      <Zap className="w-6 h-6" />
                      🎯 Solve My Cube!
                  </button>
                </div>
              )}
            </div>

            {/* 3D cube preview */}
              <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Live 3D Preview
              </h2>
              <Cube3D faces={cubeState.faces} />
              
              {validatedCount > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Drag to rotate and inspect your cube
                    </p>
                    {validatedCount < 6 && (
                      <p className="text-sm text-blue-600 font-medium">
                        {6 - validatedCount} more face{6 - validatedCount !== 1 ? 's' : ''} to go!
                      </p>
                    )}
                </div>
              )}
            </div>
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 3D cube with animation */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Live Cube Animation
              </h2>
              <Cube3D
                faces={cubeState.faces}
                currentStep={currentAnimationStep}
                isAnimating={true}
              />
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSolver(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" />
                  Back to Capture
                </button>
              </div>
            </div>

            {/* Solver animation controls */}
            <div>
              <SolverAnimation
                steps={solveSteps}
                onStepChange={handleStepChange}
              />
            </div>
          </div>
        )}
      </main>

      {/* Camera capture modal */}
      {currentCapturing !== null && (
        <CameraCapture
          onCapture={handleCaptureComplete}
          onCancel={handleCancelCapture}
          faceNumber={currentCapturing}
          totalFaces={6}
          isValidating={isValidating}
        />
      )}

      {/* Photo upload modal */}
      {currentUploading !== null && (
        <PhotoUpload
          onUpload={handleCaptureComplete}
          onCancel={handleCancelUpload}
          faceNumber={currentUploading}
          totalFaces={6}
          isValidating={isValidating}
        />
      )}
      {/* Welcome guide */}
      {showWelcome && (
        <WelcomeGuide
          onStart={handleWelcomeStart}
          onSkip={handleWelcomeSkip}
        />
      )}
    </div>
  );
}

export default App;