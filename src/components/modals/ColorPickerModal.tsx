import React, { useState } from 'react';
import { Palette, Plus, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onColorSelect
}) => {
  const [customColor, setCustomColor] = useState('#000000');
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const colorPalettes = {
    basic: {
      name: 'Basic Colors',
      description: 'Essential colors for any artwork',
      colors: [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FF8000', '#8000FF', '#FF0080', '#80FF00'
      ]
    },
    pastels: {
      name: 'Pastel Colors',
      description: 'Soft, gentle tones',
      colors: [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D4BAFF',
        '#FFB3E6', '#C9BAFF', '#FFCCCB', '#F0E68C', '#E0FFFF', '#F5DEB3',
        '#DDA0DD', '#98FB98', '#F0F8FF', '#FFEFD5'
      ]
    },
    earth: {
      name: 'Earth Tones',
      description: 'Natural, earthy colors',
      colors: [
        '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#F4A460',
        '#DEB887', '#D2B48C', '#BDB76B', '#DAA520', '#B8860B', '#CD5C5C',
        '#696969', '#708090', '#2F4F4F', '#556B2F'
      ]
    },
    neon: {
      name: 'Neon & Bright',
      description: 'Vibrant, eye-catching colors',
      colors: [
        '#FF073A', '#39FF14', '#0080FF', '#FF1493', '#00FFFF', '#FFFF00',
        '#FF4500', '#9400D3', '#00FF7F', '#FF69B4', '#1E90FF', '#FFD700',
        '#FF6347', '#7FFF00', '#FF1493', '#00CED1'
      ]
    }
  };

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    
    // Add to recent colors
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 12);
    });
    
    onClose();
  };

  const handleCustomColorUse = () => {
    handleColorSelect(customColor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Your Color
          </DialogTitle>
          <DialogDescription>
            Select from organized color palettes or create your own custom color.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Current Color Display */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Current Color:</div>
            <div 
              className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="text-sm text-gray-600 font-mono">{selectedColor}</div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(colorPalettes).map(([key, palette]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {palette.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(colorPalettes).map(([key, palette]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="font-medium">{palette.name}</h3>
                    <p className="text-sm text-gray-600">{palette.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-2">
                    {palette.colors.map((color) => (
                      <button
                        key={color}
                        className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md ${
                          selectedColor === color
                            ? 'border-blue-500 shadow-lg scale-105'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h3 className="font-medium">Recently Used</h3>
                <Badge variant="secondary" className="text-xs">
                  {recentColors.length}
                </Badge>
              </div>
              <div className="grid grid-cols-12 gap-2">
                {recentColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      selectedColor === color
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Custom Color Picker */}
          <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4" />
              <h3 className="font-medium">Custom Color</h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
              <Button
                onClick={handleCustomColorUse}
                variant="outline"
                size="sm"
              >
                Use Color
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPickerModal;
