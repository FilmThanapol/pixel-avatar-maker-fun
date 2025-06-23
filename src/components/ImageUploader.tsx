
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageProcessed: (gridData: string[][]) => void;
  gridSize: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed, gridSize }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const pixelatedGrid = convertImageToPixels(img, gridSize);
        onImageProcessed(pixelatedGrid);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const convertImageToPixels = (img: HTMLImageElement, size: number): string[][] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return [];

    canvas.width = size;
    canvas.height = size;

    // Draw and scale the image to fit the grid
    ctx.drawImage(img, 0, 0, size, size);
    
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    
    const grid: string[][] = [];
    
    for (let row = 0; row < size; row++) {
      grid[row] = [];
      for (let col = 0; col < size; col++) {
        const i = (row * size + col) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Convert to hex color or transparent
        if (a < 128) {
          grid[row][col] = '';
        } else {
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          grid[row][col] = hex;
        }
      }
    }
    
    return grid;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">Upload Image</h3>
      <Button
        onClick={handleFileSelect}
        className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Upload className="w-4 h-4" />
        Choose Image
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-gray-600 mt-2 text-center">
        Upload any image to convert to pixel art
      </p>
    </div>
  );
};

export default ImageUploader;
