
import React, { useState, useEffect } from 'react';
import PixelGrid from '../components/PixelGrid';
import ColorPicker from '../components/ColorPicker';
import ImageUploader from '../components/ImageUploader';
import GridSizeSelector from '../components/GridSizeSelector';
import { createEmptyGrid, saveToLocalStorage, loadFromLocalStorage, exportToPNG } from '../utils/pixelArtUtils';
import { Download, RotateCcw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // Load saved data or use defaults
  const savedData = loadFromLocalStorage(16);
  const [gridSize, setGridSize] = useState(savedData.size);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [gridData, setGridData] = useState<string[][]>(savedData.gridData);

  // Auto-save to localStorage when grid changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(gridData, gridSize);
    }, 500); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [gridData, gridSize]);

  const handlePixelClick = (row: number, col: number) => {
    const newGrid = [...gridData];
    newGrid[row][col] = selectedColor;
    setGridData(newGrid);
  };

  const handleClear = () => {
    setGridData(createEmptyGrid(gridSize));
    toast({
      title: "Canvas cleared",
      description: "Your pixel art has been reset.",
    });
  };

  const handleExport = () => {
    exportToPNG(gridData, gridSize, 'my-pixel-avatar');
    toast({
      title: "Avatar exported!",
      description: "Your pixel art has been downloaded as a PNG file.",
    });
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    setGridData(createEmptyGrid(newSize));
    toast({
      title: "Grid size changed",
      description: `Canvas resized to ${newSize}x${newSize}`,
    });
  };

  const handleImageProcessed = (processedGrid: string[][]) => {
    setGridData(processedGrid);
    toast({
      title: "Image converted!",
      description: "Your image has been converted to pixel art.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            PixelFrame
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow">
            Create pixel art avatars or convert images to pixel art!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Controls */}
          <div className="order-2 lg:order-1 space-y-4">
            <GridSizeSelector
              currentSize={gridSize}
              onSizeChange={handleGridSizeChange}
            />
            <ImageUploader
              onImageProcessed={handleImageProcessed}
              gridSize={gridSize}
            />
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>

          {/* Pixel Grid */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-4">
            <PixelGrid
              size={gridSize}
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
              <li>• Choose grid size (8x8, 16x16, or 32x32)</li>
              <li>• Upload an image to convert to pixel art</li>
              <li>• Select colors from the palette</li>
              <li>• Click or drag on the grid to paint</li>
              <li>• Use "Clear" to start over</li>
              <li>• Export your creation as PNG</li>
              <li>• Your work auto-saves as you draw!</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Try uploading photos to convert them into pixel art, 
                then edit and enhance them with the drawing tools!
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
