import React, { useRef, useEffect, useState } from 'react';
import { CubeFace } from '../types/cube';
import { useTheme } from '../contexts/ThemeContext';

interface Cube3DProps {
  faces: CubeFace[];
  currentStep?: number;
  isAnimating?: boolean;
}

export const Cube3D: React.FC<Cube3DProps> = ({ faces, currentStep = 0, isAnimating = false }) => {
  const { isDark } = useTheme();
  const cubeRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setLastMouse({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMouse.x;
    const deltaY = touch.clientY - lastMouse.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    setLastMouse({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotation(prev => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, lastMouse]);

  const getFaceStyle = (face: CubeFace) => {
    const baseStyle = "absolute w-full h-full border-2 border-gray-300 flex items-center justify-center text-2xl font-bold";
    
    switch (face.position) {
      case 'front':
        return `${baseStyle} bg-red-400 text-white transform translateZ(50px)`;
      case 'back':
        return `${baseStyle} bg-blue-400 text-white transform translateZ(-50px) rotateY(180deg)`;
      case 'right':
        return `${baseStyle} bg-green-400 text-white transform rotateY(90deg) translateZ(50px)`;
      case 'left':
        return `${baseStyle} bg-yellow-400 text-black transform rotateY(-90deg) translateZ(50px)`;
      case 'top':
        return `${baseStyle} bg-purple-400 text-white transform rotateX(90deg) translateZ(50px)`;
      case 'bottom':
        return `${baseStyle} bg-orange-400 text-white transform rotateX(-90deg) translateZ(50px)`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="relative w-full h-96 flex items-center justify-center perspective-1000">
      <div
        ref={cubeRef}
        className="relative w-24 h-24 transform-style-preserve-3d cursor-grab active:cursor-grabbing"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {faces.map((face, index) => (
          <div
            key={index}
            className={getFaceStyle(face)}
          >
            {face.content}
          </div>
        ))}
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
          isDark 
            ? 'text-blue-300 bg-gray-800 bg-opacity-80' 
            : 'text-blue-700 bg-white bg-opacity-80'
        }`}>
          🖱️ Drag to rotate • 📱 Touch and drag on mobile
        </p>
      </div>
    </div>
  );
};