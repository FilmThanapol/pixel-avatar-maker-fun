import React from 'react';
import { Grid3X3, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GridSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: number;
  onSizeChange: (size: number) => void;
}

const GridSizeModal: React.FC<GridSizeModalProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSizeChange
}) => {
  const sizeOptions = [
    { value: 8, label: 'Tiny', description: '8×8 pixels', category: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 16, label: 'Small', description: '16×16 pixels', category: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 24, label: 'Medium', description: '24×24 pixels', category: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { value: 32, label: 'Large', description: '32×32 pixels', category: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { value: 48, label: 'Extra Large', description: '48×48 pixels', category: 'Advanced', color: 'bg-orange-100 text-orange-800' },
    { value: 64, label: 'Huge', description: '64×64 pixels', category: 'Advanced', color: 'bg-orange-100 text-orange-800' },
    { value: 96, label: 'Massive', description: '96×96 pixels', category: 'Expert', color: 'bg-red-100 text-red-800' },
    { value: 128, label: 'Ultra', description: '128×128 pixels', category: 'Expert', color: 'bg-red-100 text-red-800' }
  ];

  const handleSizeSelect = (size: number) => {
    onSizeChange(size);
    onClose();
  };

  const getPerformanceWarning = (size: number) => {
    if (size >= 96) return "May impact performance on slower devices";
    if (size >= 64) return "Consider device performance";
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Choose Canvas Size
          </DialogTitle>
          <DialogDescription>
            Select the resolution for your pixel art canvas. Larger sizes offer more detail but may be harder to work with.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {sizeOptions.map((option) => {
            const isSelected = currentSize === option.value;
            const warning = getPerformanceWarning(option.value);
            
            return (
              <div
                key={option.value}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSizeSelect(option.value)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <Badge className={option.color}>
                    {option.category}
                  </Badge>
                </div>
                
                {/* Visual grid preview */}
                <div className="flex items-center justify-center my-3">
                  <div 
                    className="border border-gray-300 bg-white"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: `${60/Math.min(option.value, 12)}px ${60/Math.min(option.value, 12)}px`
                    }}
                  />
                </div>

                {warning && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    {warning}
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Current: <span className="font-medium">{currentSize}×{currentSize}</span>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GridSizeModal;
