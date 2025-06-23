import React, { useState } from 'react';
import { Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { exportToPNG, ExportOptions } from '../utils/pixelArtUtils';

interface ExportOptionsProps {
  gridData: string[][];
  gridSize: number;
}

const ExportOptionsComponent: React.FC<ExportOptionsProps> = ({ gridData, gridSize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [includeGrid, setIncludeGrid] = useState(false);
  const [scale, setScale] = useState([Math.max(20, 640 / gridSize)]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [filename, setFilename] = useState('pixel-avatar');

  const handleExport = () => {
    const options: Partial<ExportOptions> = {
      includeGrid,
      scale: scale[0],
      backgroundColor,
      filename
    };
    
    exportToPNG(gridData, gridSize, options);
  };

  const getEstimatedSize = () => {
    const finalScale = Math.max(scale[0], gridSize >= 64 ? 8 : 16);
    const pixels = gridSize * finalScale;
    return `${pixels}x${pixels}px`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <div className="space-y-4">
        {/* Quick Export Button */}
        <Button
          onClick={handleExport}
          className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 font-bold"
        >
          <Download className="w-4 h-4" />
          Export PNG
        </Button>

        {/* Advanced Options */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Export Options
            </span>
            <span className="text-xs text-gray-500">{getEstimatedSize()}</span>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-3 space-y-4">
            {/* Grid Lines Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-grid"
                checked={includeGrid}
                onCheckedChange={(checked) => setIncludeGrid(checked as boolean)}
              />
              <label htmlFor="include-grid" className="text-sm font-medium">
                Include grid lines
              </label>
            </div>

            {/* Scale Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Scale: {scale[0]}x ({getEstimatedSize()})
              </label>
              <Slider
                value={scale}
                onValueChange={setScale}
                max={50}
                min={4}
                step={2}
                className="w-full"
              />
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">{backgroundColor}</span>
              </div>
            </div>

            {/* Filename */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="pixel-avatar"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ExportOptionsComponent;
