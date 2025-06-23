
import React, { useState, useEffect } from 'react';
import PixelGrid from '../components/PixelGrid';
import ColorPicker from '../components/ColorPicker';
import { createEmptyGrid, saveToLocalStorage, loadFromLocalStorage, exportToPNG } from '../utils/pixelArtUtils';
import { Download, RotateCcw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const GRID_SIZE = 16;
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [gridData, setGridData] = useState<string[][]>(() => 
    loadFromLocalStorage(GRID_SIZE)
  );
  const { toast } = useToast();

  // Auto-save to localStorage when grid changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(gridData);
    }, 500); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [gridData]);

  const handlePixelClick = (row: number, col: number) => {
    const newGrid = [...gridData];
    newGrid[row][col] = selectedColor;
    setGridData(newGrid);
  };

  const handleClear = () => {
    setGridData(createEmptyGrid(GRID_SIZE));
    toast({
      title: "Canvas cleared",
      description: "Your pixel art has been reset.",
    });
  };

  const handleExport = () => {
    exportToPNG(gridData, GRID_SIZE, 'my-pixel-avatar');
    toast({
      title: "Avatar exported!",
      description: "Your pixel art has been downloaded as a PNG file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            PixelFrame
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow">
            Create your own pixel art avatar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Color Picker */}
          <div className="order-2 lg:order-1">
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>

          {/* Pixel Grid */}
          <div className="order-1 lg:order-2 space-y-4">
            <PixelGrid
              size={GRID_SIZE}
              selectedColor={selectedColor}
              gridData={gridData}
              onPixelClick={handlePixelClick}
              onGridUpdate={setGridData}
            />

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleClear}
                variant="destructive"
                className="flex items-center gap-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
              <Button
                onClick={handleExport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 font-bold"
              >
                <Download className="w-4 h-4" />
                Export PNG
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="order-3 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
            <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              How to Use
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Select a color from the palette</li>
              <li>• Click or drag on the grid to paint</li>
              <li>• Use different colors to create your avatar</li>
              <li>• Click "Clear" to start over</li>
              <li>• Click "Export PNG" to download your art</li>
              <li>• Your work auto-saves as you draw!</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Try creating faces, characters, or abstract patterns. 
                The exported image will be crisp and perfect for avatars!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/80">
          <p className="text-sm">
            Made with ❤️ for pixel art enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
