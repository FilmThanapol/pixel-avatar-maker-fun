
import React, { useState, useEffect } from 'react';
import PixelGrid from '../components/PixelGrid';
import ColorPicker from '../components/ColorPicker';
import ImageUploader from '../components/ImageUploader';
import GridSizeSelector from '../components/GridSizeSelector';
import ExportOptions from '../components/ExportOptions';
import RandomGenerator from '../components/RandomGenerator';
import PixelZoomPreview from '../components/PixelZoomPreview';
import SoundControls from '../components/SoundControls';
import { createEmptyGrid, saveToLocalStorage, loadFromLocalStorage } from '../utils/pixelArtUtils';
import { playPixelPaint, playPixelErase, playClear, playGridSizeChange, playColorSelect } from '../utils/soundEffects';
import { RotateCcw, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  // Load saved data or use defaults
  const savedData = loadFromLocalStorage(16);
  const [gridSize, setGridSize] = useState(savedData.size);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [gridData, setGridData] = useState<string[][]>(savedData.gridData);
  const [hoveredPixel, setHoveredPixel] = useState<{ row: number; col: number } | null>(null);
  const [showAnimations, setShowAnimations] = useState(true);

  // Auto-save to localStorage when grid changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(gridData, gridSize);
    }, 500); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [gridData, gridSize]);

  const handlePixelClick = (row: number, col: number) => {
    const newGrid = [...gridData];
    const wasEmpty = !newGrid[row][col];
    newGrid[row][col] = selectedColor;
    setGridData(newGrid);

    // Play sound effect
    if (wasEmpty) {
      playPixelPaint();
    } else {
      playPixelErase();
    }
  };

  const handlePixelHover = (row: number, col: number) => {
    setHoveredPixel({ row, col });
  };

  const handlePixelLeave = () => {
    setHoveredPixel(null);
  };

  const handleClear = () => {
    setGridData(createEmptyGrid(gridSize));
    playClear();
    toast({
      title: "Canvas cleared",
      description: "Your pixel art has been reset.",
    });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    playColorSelect();
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    setGridData(createEmptyGrid(newSize));
    playGridSizeChange();
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

  const handleRandomGenerate = (newGrid: string[][]) => {
    setGridData(newGrid);
    toast({
      title: "Random pattern generated!",
      description: "A new pixel art pattern has been created.",
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
          {/* Left Controls */}
          <div className="order-2 xl:order-1 space-y-4">
            <GridSizeSelector
              currentSize={gridSize}
              onSizeChange={handleGridSizeChange}
            />
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
            <SoundControls />
          </div>

          {/* Pixel Grid */}
          <div className="order-1 xl:order-2 xl:col-span-2 space-y-4">
            <PixelGrid
              size={gridSize}
              selectedColor={selectedColor}
              gridData={gridData}
              onPixelClick={handlePixelClick}
              onGridUpdate={setGridData}
              onPixelHover={handlePixelHover}
              onPixelLeave={handlePixelLeave}
            />

            {/* Main Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleClear}
                variant="destructive"
                className="flex items-center gap-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Canvas
              </Button>
            </div>
          </div>

          {/* Right Panel - Tools & Preview */}
          <div className="order-3 xl:order-3 xl:col-span-2 space-y-4">
            {/* Pixel Zoom Preview */}
            <PixelZoomPreview
              gridData={gridData}
              gridSize={gridSize}
              hoveredPixel={hoveredPixel}
              selectedColor={selectedColor}
            />

            {/* Export Options */}
            <ExportOptions
              gridData={gridData}
              gridSize={gridSize}
            />

            {/* Random Generator */}
            <RandomGenerator
              gridSize={gridSize}
              onGenerateGrid={handleRandomGenerate}
            />

            {/* Image Uploader */}
            <ImageUploader
              onImageProcessed={handleImageProcessed}
              gridSize={gridSize}
            />

            {/* Instructions */}
            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
              <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                How to Use
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choose from 8 different grid sizes</li>
                <li>• Select from 40+ organized colors</li>
                <li>• Use zoom controls for large grids</li>
                <li>• Generate random patterns for inspiration</li>
                <li>• Upload images to convert to pixel art</li>
                <li>• Export with custom options & grid lines</li>
                <li>• Enjoy sound effects while you create!</li>
              </ul>
              <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-200">
                <p className="text-xs text-purple-800">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  <strong>Pro Tips:</strong> Use Ctrl+Scroll to zoom, Ctrl+Click to pan large grids,
                  and hover over pixels for a magnified preview!
                </p>
              </div>
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
