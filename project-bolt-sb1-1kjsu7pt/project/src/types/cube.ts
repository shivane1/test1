export type CubeColor = 'white' | 'red' | 'blue' | 'orange' | 'green' | 'yellow';

export interface CubeFace {
  id: number;
  name: string;
  colors: CubeColor[][];
  captured: boolean;
  validated: boolean;
  imageData?: string;
}

export interface CubeState {
  faces: CubeFace[];
  isComplete: boolean;
  isSolved: boolean;
}

export interface SolveStep {
  id: number;
  notation: string;
  description: string;
  face: string;
  direction: 'clockwise' | 'counterclockwise';
  handGesture: HandGesture;
}

export interface HandGesture {
  type: 'rotate' | 'hold' | 'flip';
  direction: 'up' | 'down' | 'left' | 'right' | 'clockwise' | 'counterclockwise';
  fingers: ('thumb' | 'index' | 'middle' | 'ring' | 'pinky')[];
  description: string;
}

export interface CubePosition {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}