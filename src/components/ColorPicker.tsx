
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Palette, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  const [customColor, setCustomColor] = useState('#000000');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    pastels: false,
    earth: false,
    neon: false
  });

  const colorPalettes = {
    basic: {
      name: 'Basic Colors',
      colors: [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FF8000', '#8000FF', '#FF0080', '#80FF00'
      ]
    },
    pastels: {
      name: 'Pastel Colors',
      colors: [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D4BAFF',
        '#FFB3E6', '#C9BAFF', '#FFCCCB', '#F0E68C', '#E0FFFF', '#F5DEB3',
        '#DDA0DD', '#98FB98', '#F0F8FF', '#FFEFD5'
      ]
    },
    earth: {
      name: 'Earth Tones',
      colors: [
        '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#F4A460',
        '#DEB887', '#D2B48C', '#BDB76B', '#DAA520', '#B8860B', '#CD5C5C',
        '#696969', '#708090', '#2F4F4F', '#556B2F'
      ]
    },
    neon: {
      name: 'Neon & Bright',
      colors: [
        '#FF073A', '#39FF14', '#0080FF', '#FF1493', '#00FFFF', '#FFFF00',
        '#FF4500', '#9400D3', '#00FF7F', '#FF69B4', '#1E90FF', '#FFD700',
        '#FF6347', '#7FFF00', '#FF1493', '#00CED1'
      ]
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center flex items-center justify-center gap-2">
        <Palette className="w-5 h-5" />
        Color Palette
      </h3>

      <div className="space-y-3">
        {Object.entries(colorPalettes).map(([key, palette]) => (
          <Collapsible key={key} open={openSections[key]} onOpenChange={() => toggleSection(key)}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
              <span>{palette.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections[key] ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="grid grid-cols-6 gap-1.5">
                {palette.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                      selectedColor === color
                        ? 'border-gray-800 shadow-lg scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Custom Color Picker */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Custom Color</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onColorSelect(customColor)}
              className="text-xs"
            >
              Use Color
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center border-t pt-3">
        <div
          className="inline-block w-12 h-12 rounded-lg border-2 border-gray-800 shadow-md"
          style={{ backgroundColor: selectedColor }}
        />
        <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
      </div>
    </div>
  );
};

export default ColorPicker;
