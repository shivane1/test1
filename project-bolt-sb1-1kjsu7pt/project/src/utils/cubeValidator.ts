import { CubeColor } from '../types/cube';

export class CubeValidator {
  private static readonly VALID_COLORS: CubeColor[] = ['white', 'red', 'blue', 'orange', 'green', 'yellow'];
  
  static validateFace(imageData: string): Promise<{ isValid: boolean; colors: CubeColor[][] | null; confidence: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const result = this.analyzeImage(ctx, canvas.width, canvas.height);
        resolve(result);
      };
      img.src = imageData;
    });
  }
  
  private static analyzeImage(ctx: CanvasRenderingContext2D, width: number, height: number): { isValid: boolean; colors: CubeColor[][] | null; confidence: number } {
    const colors: CubeColor[][] = [];
    const gridSize = 3;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    let validCells = 0;
    
    for (let row = 0; row < gridSize; row++) {
      colors[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        
        const detectedColor = this.detectColor(r, g, b);
        colors[row][col] = detectedColor;
        
        if (detectedColor) {
          validCells++;
        }
      }
    }
    
    const confidence = validCells / 9;
    const isValid = confidence >= 0.7; // At least 70% of cells must be valid colors
    
    return {
      isValid,
      colors: isValid ? colors : null,
      confidence
    };
  }
  
  private static detectColor(r: number, g: number, b: number): CubeColor {
    const colors = [
      { name: 'white' as CubeColor, rgb: [255, 255, 255] },
      { name: 'red' as CubeColor, rgb: [255, 0, 0] },
      { name: 'blue' as CubeColor, rgb: [0, 0, 255] },
      { name: 'orange' as CubeColor, rgb: [255, 165, 0] },
      { name: 'green' as CubeColor, rgb: [0, 255, 0] },
      { name: 'yellow' as CubeColor, rgb: [255, 255, 0] }
    ];
    
    let minDistance = Infinity;
    let closestColor: CubeColor = 'white';
    
    for (const color of colors) {
      const distance = Math.sqrt(
        Math.pow(r - color.rgb[0], 2) +
        Math.pow(g - color.rgb[1], 2) +
        Math.pow(b - color.rgb[2], 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }
    
    // Only return color if it's close enough (threshold for color detection)
    return minDistance < 100 ? closestColor : 'white';
  }
  
  static validateCompleteCube(faces: any[]): boolean {
    // Check if we have exactly 6 faces
    if (faces.length !== 6) return false;
    
    // Check if all faces are validated
    if (!faces.every(face => face.validated)) return false;
    
    // Count colors across all faces
    const colorCounts: Record<CubeColor, number> = {
      white: 0, red: 0, blue: 0, orange: 0, green: 0, yellow: 0
    };
    
    faces.forEach(face => {
      if (face.colors) {
        face.colors.forEach((row: CubeColor[]) => {
          row.forEach((color: CubeColor) => {
            colorCounts[color]++;
          });
        });
      }
    });
    
    // Each color should appear exactly 9 times (one face)
    return Object.values(colorCounts).every(count => count === 9);
  }
}