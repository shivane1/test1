import { CubeFace, SolveStep, HandGesture } from '../types/cube';

export class CubeSolver {
  private static readonly SOLVE_ALGORITHMS = {
    'white_cross': [
      { notation: "F", description: "Rotate front face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" }
    ],
    'white_corners': [
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "D", description: "Rotate down face clockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" },
      { notation: "D'", description: "Rotate down face counterclockwise" }
    ],
    'middle_layer': [
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U'", description: "Rotate upper face counterclockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" },
      { notation: "U'", description: "Rotate upper face counterclockwise" },
      { notation: "F'", description: "Rotate front face counterclockwise" },
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "F", description: "Rotate front face clockwise" }
    ],
    'yellow_cross': [
      { notation: "F", description: "Rotate front face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" },
      { notation: "U'", description: "Rotate upper face counterclockwise" },
      { notation: "F'", description: "Rotate front face counterclockwise" }
    ],
    'yellow_corners': [
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" },
      { notation: "U", description: "Rotate upper face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U2", description: "Rotate upper face 180 degrees" },
      { notation: "R'", description: "Rotate right face counterclockwise" }
    ],
    'final_layer': [
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U'", description: "Rotate upper face counterclockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "F", description: "Rotate front face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "F'", description: "Rotate front face counterclockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "U'", description: "Rotate upper face counterclockwise" },
      { notation: "R'", description: "Rotate right face counterclockwise" },
      { notation: "F", description: "Rotate front face clockwise" },
      { notation: "R", description: "Rotate right face clockwise" },
      { notation: "F'", description: "Rotate front face counterclockwise" }
    ]
  };

  static solveCube(faces: CubeFace[]): SolveStep[] {
    const steps: SolveStep[] = [];
    let stepId = 1;

    // Analyze cube state and generate solution steps
    const algorithms = [
      'white_cross',
      'white_corners', 
      'middle_layer',
      'yellow_cross',
      'yellow_corners',
      'final_layer'
    ];

    algorithms.forEach(algorithm => {
      const algorithmSteps = this.SOLVE_ALGORITHMS[algorithm as keyof typeof this.SOLVE_ALGORITHMS];
      algorithmSteps.forEach(step => {
        steps.push({
          id: stepId++,
          notation: step.notation,
          description: step.description,
          face: this.getFaceFromNotation(step.notation),
          direction: step.notation.includes("'") ? 'counterclockwise' : 'clockwise',
          handGesture: this.getHandGesture(step.notation)
        });
      });
    });

    return steps;
  }

  private static getFaceFromNotation(notation: string): string {
    const face = notation.replace(/['2]/g, '');
    const faceMap: Record<string, string> = {
      'F': 'Front',
      'B': 'Back', 
      'R': 'Right',
      'L': 'Left',
      'U': 'Up',
      'D': 'Down'
    };
    return faceMap[face] || 'Front';
  }

  private static getHandGesture(notation: string): HandGesture {
    const face = notation.replace(/['2]/g, '');
    const isCounterclockwise = notation.includes("'");
    const isDouble = notation.includes("2");

    const gestureMap: Record<string, HandGesture> = {
      'F': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['thumb', 'index', 'middle'],
        description: `Hold the cube with your ${isCounterclockwise ? 'left' : 'right'} hand and rotate the front face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'} with your fingers`
      },
      'R': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise', 
        fingers: ['thumb', 'index'],
        description: `Use your right thumb and index finger to rotate the right face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'U': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['index', 'middle'],
        description: `Hold the cube steady and use your fingers to rotate the top face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'L': {
        type: 'rotate', 
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['thumb', 'index'],
        description: `Use your left thumb and index finger to rotate the left face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'B': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['thumb', 'middle', 'ring'],
        description: `Rotate the cube to access the back face, then rotate it ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'D': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise', 
        fingers: ['thumb', 'index', 'middle'],
        description: `Hold the cube from the top and rotate the bottom face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      }
    };

    return gestureMap[face] || gestureMap['F'];
  }
}