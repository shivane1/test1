```javascript
        description: `Use your right thumb and index finger to rotate the right face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'U': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['index', 'middle'],
        description: `Hold the cube steady with your thumbs on the sides and use your index and middle fingers to rotate the top face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'L': {
        type: 'rotate', 
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise',
        fingers: ['thumb', 'index'],
        description: `Use your left thumb and index finger to rotate the left face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      },
      'D': {
        type: 'rotate',
        direction: isCounterclockwise ? 'counterclockwise' : 'clockwise', 
        fingers: ['thumb', 'index', 'middle'],
        description: `Hold the cube from the top with your fingers and use your thumbs to rotate the bottom face ${isCounterclockwise ? 'counterclockwise' : 'clockwise'}`
      }
    };
```