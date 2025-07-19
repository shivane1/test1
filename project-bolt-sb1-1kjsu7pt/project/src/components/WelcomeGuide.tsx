import React, { useState } from 'react';
import { Cuboid as Cube, Camera, Eye, Zap, ArrowRight, X } from 'lucide-react';

interface WelcomeGuideProps {
  onStart: () => void;
  onSkip: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onStart, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Cube className="w-12 h-12 text-blue-600" />,
      title: "Welcome to Rubik's Cube Solver!",
      description: "I'll help you solve your Rubik's cube step by step. This process takes about 2-3 minutes.",
      tip: "Make sure you have good lighting and a steady hand for the best results."
    },
    {
      icon: <Camera className="w-12 h-12 text-green-600" />,
      title: "Step 1: Capture All 6 Faces",
      description: "I'll guide you to take a photo of each face of your cube. Hold the cube steady and make sure all 9 squares are clearly visible.",
      tip: "Tip: Place the cube on a flat surface and use both hands to keep it steady."
    },
    {
      icon: <Eye className="w-12 h-12 text-purple-600" />,
      title: "Step 2: Validation & 3D Preview",
      description: "I'll check each photo to make sure it's a valid cube face, then show you a 3D preview of your cube.",
      tip: "Don't worry if a photo doesn't work - you can always retake it!"
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-600" />,
      title: "Step 3: Get Your Solution",
      description: "I'll calculate the solution and show you exactly how to move your hands to solve the cube.",
      tip: "Each step includes hand gestures and visual guides to make it super easy to follow."
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {currentStepData.description}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm font-medium">
              💡 {currentStepData.tip}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Let's Start!
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};