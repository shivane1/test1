import React from 'react';
import { Heart, Github, Linkedin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Made with love section */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Made with
            </span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              by
            </span>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Shivane
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                &
              </span>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Arpit
              </span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2025 Smart Cube Solver. All rights reserved.
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Features
              </h4>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>AI-Powered Recognition</li>
                <li>Real-time 3D Visualization</li>
                <li>Step-by-step Solutions</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Technology
              </h4>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>React + TypeScript</li>
                <li>Firebase Authentication</li>
                <li>Computer Vision</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Support
              </h4>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>User Guide</li>
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};