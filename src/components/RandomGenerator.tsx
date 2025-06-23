import React, { useState } from 'react';
import { Shuffle, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RandomGeneratorProps {
  gridSize: number;
  onGenerateGrid: (newGrid: string[][]) => void;
}

const RandomGenerator: React.FC<RandomGeneratorProps> = ({ gridSize, onGenerateGrid }) => {
  const [density, setDensity] = useState([30]);
  const [pattern, setPattern] = useState('random');

  const colorPalettes = {
    vibrant: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D4BAFF'],
    earth: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#F4A460'],
    neon: ['#FF073A', '#39FF14', '#0080FF', '#FF1493', '#00FFFF', '#FFFF00'],
    monochrome: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF']
  };

  const [selectedPalette, setSelectedPalette] = useState<keyof typeof colorPalettes>('vibrant');

  const generateRandomGrid = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const colors = colorPalettes[selectedPalette];
    const fillChance = density[0] / 100;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (Math.random() < fillChance) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          newGrid[row][col] = randomColor;
        }
      }
    }

    onGenerateGrid(newGrid);
  };

  const generatePatternGrid = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const colors = colorPalettes[selectedPalette];

    switch (pattern) {
      case 'checkerboard':
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            if ((row + col) % 2 === 0) {
              newGrid[row][col] = colors[0];
            } else {
              newGrid[row][col] = colors[1] || colors[0];
            }
          }
        }
        break;

      case 'stripes':
        for (let row = 0; row < gridSize; row++) {
          const colorIndex = Math.floor(row / 2) % colors.length;
          for (let col = 0; col < gridSize; col++) {
            newGrid[row][col] = colors[colorIndex];
          }
        }
        break;

      case 'gradient':
        for (let row = 0; row < gridSize; row++) {
          const colorIndex = Math.floor((row / gridSize) * colors.length);
          for (let col = 0; col < gridSize; col++) {
            newGrid[row][col] = colors[Math.min(colorIndex, colors.length - 1)];
          }
        }
        break;

      case 'center':
        const center = Math.floor(gridSize / 2);
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const distance = Math.max(Math.abs(row - center), Math.abs(col - center));
            const colorIndex = Math.min(distance, colors.length - 1);
            newGrid[row][col] = colors[colorIndex];
          }
        }
        break;

      default:
        generateRandomGrid();
        return;
    }

    onGenerateGrid(newGrid);
  };

  const generateNoise = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const colors = colorPalettes[selectedPalette];
    
    // Generate noise with clustering
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const noise = Math.random();
        const clusterFactor = 0.3;
        
        // Check neighbors for clustering effect
        let neighborCount = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && newGrid[nr][nc]) {
              neighborCount++;
            }
          }
        }
        
        const adjustedChance = (density[0] / 100) + (neighborCount * clusterFactor / 8);
        
        if (noise < adjustedChance) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          newGrid[row][col] = randomColor;
        }
      }
    }

    onGenerateGrid(newGrid);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Random Generator
      </h3>
      
      <div className="space-y-4">
        {/* Color Palette Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color Palette</label>
          <Select value={selectedPalette} onValueChange={(value) => setSelectedPalette(value as keyof typeof colorPalettes)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vibrant">Vibrant</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
              <SelectItem value="earth">Earth Tones</SelectItem>
              <SelectItem value="neon">Neon</SelectItem>
              <SelectItem value="monochrome">Monochrome</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Density Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Density: {density[0]}%
          </label>
          <Slider
            value={density}
            onValueChange={setDensity}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Pattern Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pattern</label>
          <Select value={pattern} onValueChange={setPattern}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="checkerboard">Checkerboard</SelectItem>
              <SelectItem value="stripes">Stripes</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="center">Center Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Buttons */}
        <div className="space-y-2">
          <Button
            onClick={pattern === 'random' ? generateRandomGrid : generatePatternGrid}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Target className="w-4 h-4" />
            Generate Pattern
          </Button>
          
          <Button
            onClick={generateNoise}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Zap className="w-4 h-4" />
            Generate Noise
          </Button>
          
          <Button
            onClick={generateRandomGrid}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Shuffle className="w-4 h-4" />
            Pure Random
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RandomGenerator;
