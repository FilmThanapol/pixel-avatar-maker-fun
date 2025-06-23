
import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  const colors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FF8000', // Orange
    '#8000FF', // Purple
    '#FF0080', // Pink
    '#80FF00', // Lime
    '#0080FF', // Light Blue
    '#FF8080', // Light Red
    '#80FF80', // Light Green
    '#8080FF', // Light Blue
    '#FFB366', // Peach
    '#B366FF', // Lavender
    '#66FFB3', // Mint
    '#FFE066', // Light Yellow
    '#808080', // Gray
    '#404040', // Dark Gray
    '#8B4513', // Brown
    '#2F4F4F', // Dark Slate Gray
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">Color Palette</h3>
      <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
              selectedColor === color
                ? 'border-gray-800 shadow-lg scale-110'
                : 'border-gray-400 hover:border-gray-600'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          />
        ))}
      </div>
      <div className="mt-4 text-center">
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
