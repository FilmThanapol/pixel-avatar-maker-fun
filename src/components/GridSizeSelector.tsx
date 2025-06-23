
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GridSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
}

const GridSizeSelector: React.FC<GridSizeSelectorProps> = ({ currentSize, onSizeChange }) => {
  const sizeOptions = [
    { value: 8, label: 'Tiny (8x8)', category: 'Small' },
    { value: 16, label: 'Small (16x16)', category: 'Small' },
    { value: 24, label: 'Medium (24x24)', category: 'Medium' },
    { value: 32, label: 'Large (32x32)', category: 'Medium' },
    { value: 48, label: 'XL (48x48)', category: 'Large' },
    { value: 64, label: 'XXL (64x64)', category: 'Large' },
    { value: 96, label: 'Huge (96x96)', category: 'Extra Large' },
    { value: 128, label: 'Massive (128x128)', category: 'Extra Large' }
  ];

  const getPerformanceWarning = (size: number) => {
    if (size >= 96) return "⚠️ Very large grid - may impact performance";
    if (size >= 64) return "⚡ Large grid - consider device performance";
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">Grid Size</h3>
      <Select value={currentSize.toString()} onValueChange={(value) => onSizeChange(Number(value))}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sizeOptions.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-gray-500">{option.category}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {getPerformanceWarning(currentSize) && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          {getPerformanceWarning(currentSize)}
        </div>
      )}
    </div>
  );
};

export default GridSizeSelector;
