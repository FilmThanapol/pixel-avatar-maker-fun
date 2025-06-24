
import React, { useState, useEffect } from 'react';
import PixelGrid from '../components/PixelGrid';
import Toolbar from '../components/Toolbar';
import WelcomeWalkthrough from '../components/WelcomeWalkthrough';
import GridSizeModal from '../components/modals/GridSizeModal';
import ExportModal from '../components/modals/ExportModal';
import ColorPickerModal from '../components/modals/ColorPickerModal';
import RandomGenerator from '../components/RandomGenerator';
import PixelZoomPreview from '../components/PixelZoomPreview';
import SoundControls from '../components/SoundControls';
import ImageUploader from '../components/ImageUploader';
import { createEmptyGrid, saveToLocalStorage, loadFromLocalStorage } from '../utils/pixelArtUtils';
import { playPixelPaint, playPixelErase, playClear, playGridSizeChange, playColorSelect, playRandomGenerate, playExport } from '../utils/soundEffects';
import { Sparkles, HelpCircle } from 'lucide-react';
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

  // Modal states
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGridSizeModal, setShowGridSizeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showRandomGenerator, setShowRandomGenerator] = useState(false);

  // Check if first time user
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('pixelframe-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

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

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleQuickExport = () => {
    // Quick export with default settings
    const options = {
      includeGrid: false,
      scale: Math.max(20, 640 / gridSize),
      backgroundColor: '#FFFFFF',
      filename: 'pixel-avatar'
    };

    // Use the existing export function
    const { exportToPNG } = require('../utils/pixelArtUtils');
    exportToPNG(gridData, gridSize, options);
    playExport();
    toast({
      title: "Exported successfully!",
      description: "Your pixel art has been downloaded.",
    });
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('pixelframe-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const showWelcomeAgain = () => {
    setShowWelcome(true);
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
    playRandomGenerate();

    // Check if this looks like a photo conversion (more varied colors) or a scene
    const uniqueColors = new Set();
    newGrid.forEach(row => row.forEach(cell => {
      if (cell) uniqueColors.add(cell);
    }));

    const isPhotoConversion = uniqueColors.size > 8;

    toast({
      title: isPhotoConversion ? "Photo converted!" : "Scene generated!",
      description: isPhotoConversion
        ? "Random photo converted to pixel art successfully."
        : "A beautiful pixel art scene has been created.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-6" role="banner">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              PixelFrame
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={showWelcomeAgain}
              className="text-white/80 hover:text-white hover:bg-white/10"
              title="Show welcome tour"
              aria-label="Show welcome tutorial"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-lg md:text-xl text-white/90 drop-shadow">
            Create beautiful pixel art with intuitive tools and instant scene generation
          </p>
        </header>

        {/* Toolbar */}
        <Toolbar
          onClear={handleClear}
          onExport={handleQuickExport}
          onRandomGenerate={() => setShowRandomGenerator(true)}
          onShowGridSettings={() => setShowGridSizeModal(true)}
          onShowColorPicker={() => setShowColorPickerModal(true)}
          onShowSoundSettings={() => setShowSoundSettings(true)}
          onShowExportSettings={() => setShowExportModal(true)}
          onShowImageUpload={() => setShowImageUpload(true)}
        />

        {/* Main Content Area */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6" role="main">
          {/* Canvas Area - Takes center stage */}
          <section className="lg:col-span-3 order-1" aria-label="Pixel art canvas">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-6 border border-white/20">
              <div role="application" aria-label={`Pixel art canvas, ${gridSize} by ${gridSize} pixels`}>
                <PixelGrid
                  size={gridSize}
                  selectedColor={selectedColor}
                  gridData={gridData}
                  onPixelClick={handlePixelClick}
                  onGridUpdate={setGridData}
                  onPixelHover={handlePixelHover}
                  onPixelLeave={handlePixelLeave}
                />
              </div>

              {/* Canvas Info */}
              <div className="mt-3 sm:mt-4 text-center" role="status" aria-live="polite">
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 text-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-white/30"
                      style={{ backgroundColor: selectedColor }}
                      aria-label={`Selected color: ${selectedColor}`}
                    />
                    <span className="text-sm font-medium">{selectedColor}</span>
                  </div>
                  <div className="text-sm" aria-label={`Canvas size: ${gridSize} by ${gridSize} pixels`}>
                    Canvas: {gridSize}×{gridSize}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Side Panel - Compact Tools */}
          <aside className="order-2 space-y-3 lg:space-y-4" aria-label="Tools and information">
            {/* Pixel Zoom Preview - Only show when hovering on desktop */}
            {hoveredPixel && (
              <div className="hidden lg:block bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <PixelZoomPreview
                  gridData={gridData}
                  gridSize={gridSize}
                  hoveredPixel={hoveredPixel}
                  selectedColor={selectedColor}
                />
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/20 text-white">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-sm lg:text-base">
                <Sparkles className="w-4 h-4" />
                Quick Tips
              </h3>
              <ul className="text-xs lg:text-sm space-y-1 lg:space-y-2 text-white/90">
                <li>• Tap toolbar buttons for tools</li>
                <li>• Long press tools for help</li>
                <li>• Try the scene generator!</li>
                <li>• Your work auto-saves</li>
              </ul>
              <Button
                variant="ghost"
                size="sm"
                onClick={showWelcomeAgain}
                className="mt-3 w-full text-white/80 hover:text-white hover:bg-white/10 min-h-[44px]"
                aria-label="Show welcome tutorial"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Show Tutorial</span>
              </Button>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            Made with ❤️ for pixel art enthusiasts
          </p>
        </div>
      </div>

      {/* Modals */}
      <WelcomeWalkthrough
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onComplete={handleWelcomeComplete}
      />

      <GridSizeModal
        isOpen={showGridSizeModal}
        onClose={() => setShowGridSizeModal(false)}
        currentSize={gridSize}
        onSizeChange={handleGridSizeChange}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        gridData={gridData}
        gridSize={gridSize}
      />

      <ColorPickerModal
        isOpen={showColorPickerModal}
        onClose={() => setShowColorPickerModal(false)}
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
      />

      {/* Expandable Panels */}
      {showSoundSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Sound Settings</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSoundSettings(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <SoundControls />
            </div>
          </div>
        </div>
      )}

      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Upload Image</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <ImageUploader
                onImageProcessed={(grid) => {
                  handleImageProcessed(grid);
                  setShowImageUpload(false);
                }}
                gridSize={gridSize}
              />
            </div>
          </div>
        </div>
      )}

      {showRandomGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Scene Generator</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRandomGenerator(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <RandomGenerator
                gridSize={gridSize}
                onGenerateGrid={(grid) => {
                  handleRandomGenerate(grid);
                  setShowRandomGenerator(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
