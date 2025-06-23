import React from 'react';
import { Sparkles, Mountain, Cat, Sunset, Building, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RandomGeneratorProps {
  gridSize: number;
  onGenerateGrid: (newGrid: string[][]) => void;
}

const RandomGenerator: React.FC<RandomGeneratorProps> = ({ gridSize, onGenerateGrid }) => {

  // Scene generation algorithms
  const generateMountainScene = (): string[][] => {
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Sky colors
    const skyColors = ['#87CEEB', '#B0E0E6', '#E0F6FF', '#F0F8FF'];
    const mountainColors = ['#8B7355', '#A0522D', '#CD853F', '#D2B48C'];
    const snowColors = ['#FFFFFF', '#F8F8FF', '#FFFAFA'];
    const grassColors = ['#228B22', '#32CD32', '#90EE90'];

    // Generate sky
    for (let row = 0; row < Math.floor(gridSize * 0.4); row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = skyColors[Math.floor(Math.random() * skyColors.length)];
      }
    }

    // Generate mountain peaks
    const peaks = [];
    for (let i = 0; i < Math.max(2, Math.floor(gridSize / 16)); i++) {
      peaks.push({
        x: Math.floor(Math.random() * gridSize),
        height: Math.floor(gridSize * 0.3) + Math.floor(Math.random() * gridSize * 0.2)
      });
    }

    // Draw mountains
    for (let col = 0; col < gridSize; col++) {
      let minHeight = gridSize;
      peaks.forEach(peak => {
        const distance = Math.abs(col - peak.x);
        const height = Math.max(0, peak.height - distance * 0.5);
        minHeight = Math.min(minHeight, gridSize - height);
      });

      for (let row = Math.floor(minHeight); row < gridSize; row++) {
        if (row < gridSize * 0.8) {
          // Mountain body
          grid[row][col] = mountainColors[Math.floor(Math.random() * mountainColors.length)];
          // Add snow caps
          if (row < minHeight + 2 && Math.random() > 0.5) {
            grid[row][col] = snowColors[Math.floor(Math.random() * snowColors.length)];
          }
        } else {
          // Grass/ground
          grid[row][col] = grassColors[Math.floor(Math.random() * grassColors.length)];
        }
      }
    }

    return grid;
  };

  const generateSunsetScene = (): string[][] => {
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Sunset gradient colors
    const sunsetColors = [
      ['#FF6B35', '#F7931E', '#FFD23F'], // Orange to yellow
      ['#FF8C42', '#FF6B35', '#C73E1D'], // Orange to red
      ['#A8E6CF', '#7FCDCD', '#81C784'], // Light green/blue
      ['#3D5A80', '#293241', '#1A1A2E']  // Dark blue/purple
    ];

    // Create gradient sky
    for (let row = 0; row < gridSize; row++) {
      const gradientIndex = Math.floor((row / gridSize) * sunsetColors.length);
      const colors = sunsetColors[Math.min(gradientIndex, sunsetColors.length - 1)];

      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = colors[Math.floor(Math.random() * colors.length)];
      }
    }

    // Add sun
    const sunX = Math.floor(gridSize * 0.7);
    const sunY = Math.floor(gridSize * 0.3);
    const sunRadius = Math.max(2, Math.floor(gridSize / 8));

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const distance = Math.sqrt((row - sunY) ** 2 + (col - sunX) ** 2);
        if (distance <= sunRadius) {
          grid[row][col] = '#FFFF00';
        } else if (distance <= sunRadius + 1) {
          grid[row][col] = '#FFA500';
        }
      }
    }

    // Add silhouette ground
    const groundHeight = Math.floor(gridSize * 0.2);
    for (let row = gridSize - groundHeight; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = '#2C3E50';
      }
    }

    return grid;
  };

  const generateCatScene = (): string[][] => {
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Background colors
    const bgColors = ['#E8F4FD', '#F0F8FF', '#F5F5DC'];

    // Fill background
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = bgColors[Math.floor(Math.random() * bgColors.length)];
      }
    }

    // Cat colors
    const catColors = ['#8B4513', '#D2691E', '#000000', '#696969', '#FFA500'];
    const selectedCatColor = catColors[Math.floor(Math.random() * catColors.length)];

    // Calculate cat proportions based on grid size
    const catWidth = Math.max(6, Math.floor(gridSize * 0.4));
    const catHeight = Math.max(8, Math.floor(gridSize * 0.5));
    const startX = Math.floor((gridSize - catWidth) / 2);
    const startY = Math.floor((gridSize - catHeight) / 2);

    // Draw cat body (oval)
    const bodyWidth = Math.floor(catWidth * 0.8);
    const bodyHeight = Math.floor(catHeight * 0.6);
    const bodyStartX = startX + Math.floor((catWidth - bodyWidth) / 2);
    const bodyStartY = startY + Math.floor(catHeight * 0.3);

    for (let row = bodyStartY; row < bodyStartY + bodyHeight; row++) {
      for (let col = bodyStartX; col < bodyStartX + bodyWidth; col++) {
        const centerX = bodyStartX + bodyWidth / 2;
        const centerY = bodyStartY + bodyHeight / 2;
        const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);
        if (distance <= Math.min(bodyWidth, bodyHeight) / 2) {
          grid[row][col] = selectedCatColor;
        }
      }
    }

    // Draw cat head (circle)
    const headRadius = Math.max(2, Math.floor(catWidth * 0.3));
    const headX = startX + Math.floor(catWidth / 2);
    const headY = startY + headRadius;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const distance = Math.sqrt((col - headX) ** 2 + (row - headY) ** 2);
        if (distance <= headRadius) {
          grid[row][col] = selectedCatColor;
        }
      }
    }

    // Add ears
    if (headRadius >= 2) {
      const earSize = Math.max(1, Math.floor(headRadius * 0.6));
      // Left ear
      for (let i = 0; i < earSize; i++) {
        for (let j = 0; j < earSize; j++) {
          const earRow = headY - headRadius + i;
          const earCol = headX - Math.floor(headRadius * 0.7) + j;
          if (earRow >= 0 && earRow < gridSize && earCol >= 0 && earCol < gridSize) {
            grid[earRow][earCol] = selectedCatColor;
          }
        }
      }
      // Right ear
      for (let i = 0; i < earSize; i++) {
        for (let j = 0; j < earSize; j++) {
          const earRow = headY - headRadius + i;
          const earCol = headX + Math.floor(headRadius * 0.7) - earSize + j;
          if (earRow >= 0 && earRow < gridSize && earCol >= 0 && earCol < gridSize) {
            grid[earRow][earCol] = selectedCatColor;
          }
        }
      }
    }

    // Add eyes
    if (headRadius >= 3) {
      const eyeY = headY - Math.floor(headRadius * 0.2);
      grid[eyeY][headX - 1] = '#000000';
      grid[eyeY][headX + 1] = '#000000';
    }

    return grid;
  };

  const generateCityscapeScene = (): string[][] => {
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Sky colors
    const skyColors = ['#87CEEB', '#B0C4DE', '#E6E6FA'];
    const buildingColors = ['#696969', '#2F4F4F', '#708090', '#4682B4', '#5F9EA0'];
    const windowColors = ['#FFFF00', '#FFA500', '#87CEEB'];

    // Fill sky
    for (let row = 0; row < Math.floor(gridSize * 0.3); row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = skyColors[Math.floor(Math.random() * skyColors.length)];
      }
    }

    // Generate buildings
    const numBuildings = Math.max(3, Math.floor(gridSize / 8));
    const buildingWidth = Math.floor(gridSize / numBuildings);

    for (let i = 0; i < numBuildings; i++) {
      const startCol = i * buildingWidth;
      const endCol = Math.min(startCol + buildingWidth, gridSize);
      const buildingHeight = Math.floor(gridSize * 0.4) + Math.floor(Math.random() * gridSize * 0.4);
      const startRow = gridSize - buildingHeight;
      const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];

      // Draw building
      for (let row = startRow; row < gridSize; row++) {
        for (let col = startCol; col < endCol; col++) {
          grid[row][col] = buildingColor;
        }
      }

      // Add windows
      if (buildingWidth >= 3 && buildingHeight >= 4) {
        for (let row = startRow + 2; row < gridSize - 1; row += 3) {
          for (let col = startCol + 1; col < endCol - 1; col += 2) {
            if (Math.random() > 0.3) {
              grid[row][col] = windowColors[Math.floor(Math.random() * windowColors.length)];
            }
          }
        }
      }
    }

    return grid;
  };

  const generateNatureScene = (): string[][] => {
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Sky and ground
    const skyColors = ['#87CEEB', '#B0E0E6', '#E0F6FF'];
    const grassColors = ['#228B22', '#32CD32', '#90EE90', '#9ACD32'];
    const treeColors = ['#8B4513', '#A0522D', '#CD853F'];
    const leafColors = ['#228B22', '#32CD32', '#006400', '#90EE90'];

    // Fill sky
    for (let row = 0; row < Math.floor(gridSize * 0.4); row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = skyColors[Math.floor(Math.random() * skyColors.length)];
      }
    }

    // Fill grass
    for (let row = Math.floor(gridSize * 0.8); row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = grassColors[Math.floor(Math.random() * grassColors.length)];
      }
    }

    // Add trees
    const numTrees = Math.max(2, Math.floor(gridSize / 12));
    for (let i = 0; i < numTrees; i++) {
      const treeX = Math.floor(Math.random() * gridSize);
      const treeHeight = Math.max(4, Math.floor(gridSize * 0.3));
      const trunkHeight = Math.floor(treeHeight * 0.4);
      const crownRadius = Math.max(2, Math.floor(treeHeight * 0.4));

      // Draw trunk
      const trunkWidth = Math.max(1, Math.floor(crownRadius * 0.3));
      const trunkStart = Math.floor(gridSize * 0.8) - trunkHeight;
      for (let row = trunkStart; row < Math.floor(gridSize * 0.8); row++) {
        for (let col = treeX - Math.floor(trunkWidth / 2); col <= treeX + Math.floor(trunkWidth / 2); col++) {
          if (col >= 0 && col < gridSize) {
            grid[row][col] = treeColors[Math.floor(Math.random() * treeColors.length)];
          }
        }
      }

      // Draw crown
      const crownY = trunkStart - Math.floor(crownRadius * 0.5);
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const distance = Math.sqrt((col - treeX) ** 2 + (row - crownY) ** 2);
          if (distance <= crownRadius) {
            grid[row][col] = leafColors[Math.floor(Math.random() * leafColors.length)];
          }
        }
      }
    }

    return grid;
  };

  const scenes = [
    { name: 'Mountain Landscape', generator: generateMountainScene, icon: Mountain },
    { name: 'Sunset View', generator: generateSunsetScene, icon: Sunset },
    { name: 'Cute Cat', generator: generateCatScene, icon: Cat },
    { name: 'City Skyline', generator: generateCityscapeScene, icon: Building },
    { name: 'Nature Scene', generator: generateNatureScene, icon: TreePine }
  ];

  const generateRandomScene = () => {
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    const generatedGrid = randomScene.generator();
    onGenerateGrid(generatedGrid);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Scene Generator
      </h3>

      <div className="space-y-4">
        {/* Main Generate Button */}
        <Button
          onClick={generateRandomScene}
          className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
        >
          <Sparkles className="w-5 h-5" />
          Generate Random Scene
        </Button>

        {/* Scene Preview Grid */}
        <div className="grid grid-cols-2 gap-2">
          {scenes.map((scene, index) => {
            const IconComponent = scene.icon;
            return (
              <Button
                key={index}
                onClick={() => onGenerateGrid(scene.generator())}
                variant="outline"
                className="flex flex-col items-center gap-1 p-3 h-auto text-xs"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-center leading-tight">{scene.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 text-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-200">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Generate beautiful pixel art scenes automatically! Each scene is optimized for your current grid size.
        </div>
      </div>
    </div>
  );
};

export default RandomGenerator;
