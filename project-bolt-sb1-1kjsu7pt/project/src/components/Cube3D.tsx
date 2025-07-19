import React, { useRef, useEffect, useState } from 'react';
import { CubeFace } from '../types/cube';

interface Cube3DProps {
  faces: CubeFace[];
  currentStep?: number;
  isAnimating?: boolean;
}

export const Cube3D: React.FC<Cube3DProps> = ({ faces, currentStep = 0, isAnimating = false }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAnimating && currentStep > 0) {
      // Animate cube rotation based on current step
      const stepRotation = currentStep * 15;
      setRotation(prev => ({
        x: prev.x + Math.sin(stepRotation * Math.PI / 180) * 5,
        y: prev.y + stepRotation
      }));
    }
  }, [currentStep, isAnimating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      white: 'bg-white border-gray-400',
      red: 'bg-red-500 border-red-600',
      blue: 'bg-blue-500 border-blue-600',
      orange: 'bg-orange-500 border-orange-600', 
      green: 'bg-green-500 border-green-600',
      yellow: 'bg-yellow-400 border-yellow-500'
    };
    return colorMap[color] || 'bg-gray-300 border-gray-400';
  };

  const renderFace = (face: CubeFace, faceClass: string) => {
    if (!face.colors) return null;

    return (
      <div className={`cube-face ${faceClass} absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90`}>
        <div className="grid grid-cols-3 gap-1 p-2 h-full">
          {face.colors.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const validFaces = faces.filter(face => face.validated);
  if (validFaces.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-400 rounded"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Capture all faces to see 3D cube</p>
          <p className="text-gray-500 text-sm mt-2">Start by taking photos of each cube face</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden border-2 border-blue-200 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={cubeRef}
          className="relative cursor-grab active:cursor-grabbing"
          style={{
            width: '200px',
            height: '200px',
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Front face */}
          {validFaces[0] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[0].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`front-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Back face */}
          {validFaces[1] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'rotateY(180deg) translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[1].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`back-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Right face */}
          {validFaces[2] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'rotateY(90deg) translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[2].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`right-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Left face */}
          {validFaces[3] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'rotateY(-90deg) translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[3].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`left-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Top face */}
          {validFaces[4] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'rotateX(90deg) translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[4].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`top-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Bottom face */}
          {validFaces[5] && (
            <div
              className="cube-face absolute w-48 h-48 border-2 border-gray-800 bg-white bg-opacity-90"
              style={{ transform: 'rotateX(-90deg) translateZ(96px)' }}
            >
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {validFaces[5].colors?.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`bottom-${rowIndex}-${colIndex}`}
                      className={`aspect-square rounded border-2 ${getColorClass(color)} shadow-sm`}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-sm text-blue-700 bg-white bg-opacity-80 rounded-lg px-3 py-2 font-medium">
          🖱️ Drag to rotate • 📱 Touch and drag on mobile
        </p>
      </div>
    </div>
  );
};