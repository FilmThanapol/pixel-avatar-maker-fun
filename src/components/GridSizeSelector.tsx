
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GridSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
}

const GridSizeSelector: React.FC<GridSizeSelectorProps> = ({ currentSize, onSizeChange }) => {
  const sizeOptions = [
    { value: 8, label: 'Low (8x8)' },
    { value: 16, label: 'Medium (16x16)' },
    { value: 32, label: 'High (32x32)' }
  ];

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
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GridSizeSelector;
