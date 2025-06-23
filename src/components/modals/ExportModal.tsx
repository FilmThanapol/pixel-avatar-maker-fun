import React, { useState } from 'react';
import { Download, Settings, Image, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToPNG, ExportOptions } from '../../utils/pixelArtUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  gridData: string[][];
  gridSize: number;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  gridData,
  gridSize
}) => {
  const [includeGrid, setIncludeGrid] = useState(false);
  const [scale, setScale] = useState([Math.max(20, 640 / gridSize)]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [filename, setFilename] = useState('pixel-avatar');

  const backgroundPresets = [
    { name: 'White', color: '#FFFFFF' },
    { name: 'Black', color: '#000000' },
    { name: 'Transparent', color: 'transparent' },
    { name: 'Light Gray', color: '#F5F5F5' },
    { name: 'Dark Gray', color: '#2D3748' }
  ];

  const handleExport = () => {
    const options: Partial<ExportOptions> = {
      includeGrid,
      scale: scale[0],
      backgroundColor: backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor,
      filename
    };
    
    exportToPNG(gridData, gridSize, options);
    onClose();
  };

  const getEstimatedSize = () => {
    const finalScale = Math.max(scale[0], gridSize >= 64 ? 8 : 16);
    const pixels = gridSize * finalScale;
    return `${pixels}×${pixels}px`;
  };

  const getFileSizeEstimate = () => {
    const pixels = gridSize * scale[0];
    const bytes = pixels * pixels * 4; // RGBA
    if (bytes > 1024 * 1024) {
      return `~${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `~${(bytes / 1024).toFixed(0)}KB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Pixel Art
          </DialogTitle>
          <DialogDescription>
            Customize your export settings and download your creation as a PNG file.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Filename */}
            <div className="space-y-2">
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-pixel-art"
              />
            </div>

            {/* Quick Export Button */}
            <Button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG ({getEstimatedSize()})
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            {/* Scale Slider */}
            <div className="space-y-3">
              <Label>
                Resolution Scale: {scale[0]}x
                <span className="text-sm text-gray-500 ml-2">
                  ({getEstimatedSize()}, {getFileSizeEstimate()})
                </span>
              </Label>
              <Slider
                value={scale}
                onValueChange={setScale}
                max={50}
                min={4}
                step={2}
                className="w-full"
              />
              <div className="text-xs text-gray-600">
                Higher values create larger, more detailed images
              </div>
            </div>

            {/* Grid Lines Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-grid"
                checked={includeGrid}
                onCheckedChange={(checked) => setIncludeGrid(checked as boolean)}
              />
              <Label htmlFor="include-grid" className="text-sm font-medium">
                Include grid lines in export
              </Label>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <Label>Background Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setBackgroundColor(preset.color)}
                    className={`w-full h-8 rounded border-2 transition-all ${
                      backgroundColor === preset.color
                        ? 'border-blue-500 scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: preset.color === 'transparent' ? '#fff' : preset.color,
                      backgroundImage: preset.color === 'transparent' 
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : undefined,
                      backgroundSize: preset.color === 'transparent' ? '8px 8px' : undefined,
                      backgroundPosition: preset.color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : undefined
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Custom color</span>
              </div>
            </div>

            {/* Filename */}
            <div className="space-y-2">
              <Label htmlFor="filename-advanced">File Name</Label>
              <Input
                id="filename-advanced"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="my-pixel-art"
              />
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Export with Settings
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
