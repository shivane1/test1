@@ .. @@
 import React, { useState, useCallback } from 'react';
+import { AuthProvider } from './contexts/AuthContext';
+import { ThemeProvider } from './contexts/ThemeContext';
 import { CubeFace, CubeState, SolveStep } from './types/cube';
@@ .. @@
 import { CubeSolver } from './utils/cubeSolver';
+import { AuthModal } from './components/AuthModal';
+import { HandGestureGuide } from './components/HandGestureGuide';
+import { RealTimeCubePosition } from './components/RealTimeCubePosition';
+import { Footer } from './components/Footer';
 import { WelcomeGuide } from './components/WelcomeGuide';
@@ .. @@
 import { PhotoUpload } from './components/PhotoUpload';
-import { Cuboid as Cube, Camera, Zap, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
+import { useAuth } from './contexts/AuthContext';
+import { useTheme } from './contexts/ThemeContext';
+import { Cuboid as Cube, Camera, Zap, CheckCircle, ArrowLeft, Sparkles, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
+
+const AppContent: React.FC = () => {
}
+  const { user, logout } = useAuth();
+  const { isDark, toggleTheme } = useTheme();