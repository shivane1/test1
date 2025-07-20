import React, { useState, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CubeFace, CubeState, SolveStep } from './types/cube';
import { CubeSolver } from './utils/cubeSolver';
import { AuthModal } from './components/AuthModal';
import { HandGestureGuide } from './components/HandGestureGuide';
import { RealTimeCubePosition } from './components/RealTimeCubePosition';
import { Footer } from './components/Footer';
import { WelcomeGuide } from './components/WelcomeGuide';
import { PhotoUpload } from './components/PhotoUpload';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { Cuboid as Cube, Camera, Zap, CheckCircle, ArrowLeft, Sparkles, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [cubeState, setCubeState] = useState<CubeState>({
    faces: [
      { id: 1, name: 'Front', colors: Array(9).fill(''), captured: false, validated: false },
      { id: 2, name: 'Back', colors: Array(9).fill(''), captured: false, validated: false },
      { id: 3, name: 'Left', colors: Array(9).fill(''), captured: false, validated: false },
      { id: 4, name: 'Right', colors: Array(9).fill(''), captured: false, validated: false },
      { id: 5, name: 'Top', colors: Array(9).fill(''), captured: false, validated: false },
      { id: 6, name: 'Bottom', colors: Array(9).fill(''), captured: false, validated: false },
    ],
    isComplete: false
  });
  const [showSolver, setShowSolver] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedHandGuide, setExpandedHandGuide] = useState(false);
  const [cubePosition, setCubePosition] = useState({
    x: 0, y: 0, z: 0,
    rotationX: -15, rotationY: 45, rotationZ: 0
  });

  const handleCaptureFace = useCallback((faceId: number) => {
    setCubeState(prev => ({
      ...prev,
      faces: prev.faces.map(face => 
        face.id === faceId 
          ? { ...face, captured: true, validated: true }
          : face
      ),
      isComplete: prev.faces.filter(f => f.id !== faceId || f.validated).length === 5
    }));
  }, []);

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    setHasStarted(true);
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
    setHasStarted(true);
  };

  const handlePositionUpdate = (position: any) => {
    setCubePosition(position);
  };

  const validatedCount = cubeState.faces.filter(face => face.validated).length;
  const nextFaceToCapture = cubeState.faces.find(face => !face.captured)?.id || null;

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cube className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                {cubeState.isComplete && (
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Smart Cube Solver
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Auth section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {user.displayName || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
              
              {showSolver && (
                <button
                  onClick={() => setShowSolver(false)}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Capture
                </button>
              )}
              
              <div className="text-right">
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {validatedCount}/6 faces ready
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {cubeState.isComplete ? 'Ready to solve!' : `${6 - validatedCount} remaining`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showSolver ? (
          <PhotoUpload
            cubeState={cubeState}
            onCaptureFace={handleCaptureFace}
            nextFaceToCapture={nextFaceToCapture}
            onStartSolver={() => setShowSolver(true)}
          />
        ) : (
          <div className="space-y-8">
            {/* Hand Gesture Guide */}
            {solveSteps[currentAnimationStep] && (
              <HandGestureGuide
                step={solveSteps[currentAnimationStep]}
                isExpanded={expandedHandGuide}
                onToggle={() => setExpandedHandGuide(!expandedHandGuide)}
              />
            )}
            
            <div className="grid lg:grid-cols-2 gap-8">
            {/* 3D cube with animation */}
            <div>
              <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Live Cube Animation
              </h2>
              <Cube3D
                cubeState={cubeState}
                currentStep={currentAnimationStep}
                solveSteps={solveSteps}
              />
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSolver(false)}
                    className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors font-medium mx-auto ${
                      isDark 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                  Back to Capture
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Real-time position tracking */}
              <RealTimeCubePosition
                faces={cubeState.faces}
                currentStep={currentAnimationStep}
                targetPosition={{
                  x: 0, y: 0, z: 0,
                  rotationX: -15 + currentAnimationStep * 10,
                  rotationY: 45 + currentAnimationStep * 15,
                  rotationZ: 0
                }}
                onPositionUpdate={handlePositionUpdate}
              />
              
              {/* Solver animation controls */}
              <SolverAnimation
                steps={solveSteps}
                onStepChange={handleStepChange}
              />
            </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Camera capture modal */}

      {/* Welcome guide */}
      {showWelcome && (
        <WelcomeGuide
          onStart={handleWelcomeStart}
          onSkip={handleWelcomeSkip}
        />
      )}
      
      {/* Auth modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;