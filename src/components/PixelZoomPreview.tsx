import React from 'react';
import { Eye } from 'lucide-react';

interface PixelZoomPreviewProps {
  gridData: string[][];
  gridSize: number;
  hoveredPixel: { row: number; col: number } | null;
  selectedColor: string;
}

const PixelZoomPreview: React.FC<PixelZoomPreviewProps> = ({
  gridData,
  gridSize,
  hoveredPixel,
  selectedColor
}) => {
  if (!hoveredPixel) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
        <h3 className="text-lg font-bold mb-3 text-gray-800 text-center flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" />
          Pixel Preview
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
          Hover over the canvas to see a zoomed preview
        </div>
      </div>
    );
  }

  const { row, col } = hoveredPixel;
  const previewSize = 5; // 5x5 preview area
  const centerOffset = Math.floor(previewSize / 2);
  
  // Create preview grid centered on hovered pixel
  const previewGrid: (string | null)[][] = [];
  
  for (let r = 0; r < previewSize; r++) {
    const previewRow: (string | null)[] = [];
    for (let c = 0; c < previewSize; c++) {
      const gridRow = row - centerOffset + r;
      const gridCol = col - centerOffset + c;
      
      if (gridRow >= 0 && gridRow < gridSize && gridCol >= 0 && gridCol < gridSize) {
        // Show preview of what the pixel would look like if painted
        if (gridRow === row && gridCol === col) {
          previewRow.push(selectedColor);
        } else {
          previewRow.push(gridData[gridRow][gridCol] || null);
        }
      } else {
        previewRow.push(null); // Out of bounds
      }
    }
    previewGrid.push(previewRow);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center flex items-center justify-center gap-2">
        <Eye className="w-5 h-5" />
        Pixel Preview
      </h3>
      
      <div className="space-y-3">
        {/* Zoomed Preview Grid */}
        <div className="flex justify-center">
          <div 
            className="inline-grid gap-1 border-2 border-gray-400 p-2 bg-gray-50"
            style={{
              gridTemplateColumns: `repeat(${previewSize}, 1fr)`,
            }}
          >
            {previewGrid.map((row, rowIndex) =>
              row.map((pixel, colIndex) => {
                const isCenter = rowIndex === centerOffset && colIndex === centerOffset;
                const isOutOfBounds = pixel === null;
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-6 h-6 border ${
                      isCenter 
                        ? 'border-2 border-red-500 shadow-lg' 
                        : 'border-gray-300'
                    } ${
                      isOutOfBounds 
                        ? 'bg-gray-200 opacity-50' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: isOutOfBounds 
                        ? '#E5E7EB' 
                        : pixel || '#FFFFFF',
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Pixel Information */}
        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-gray-700">
            Position: ({col}, {row})
          </div>
          <div className="text-xs text-gray-500">
            Current: {gridData[row][col] || 'Empty'}
          </div>
          <div className="text-xs text-gray-500">
            Preview: {selectedColor}
          </div>
        </div>

        {/* Color Comparison */}
        <div className="flex justify-center gap-2">
          <div className="text-center">
            <div 
              className="w-8 h-8 border-2 border-gray-300 rounded mx-auto mb-1"
              style={{ backgroundColor: gridData[row][col] || '#FFFFFF' }}
            />
            <div className="text-xs text-gray-600">Current</div>
          </div>
          <div className="flex items-center">
            <div className="text-gray-400">→</div>
          </div>
          <div className="text-center">
            <div 
              className="w-8 h-8 border-2 border-gray-300 rounded mx-auto mb-1"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="text-xs text-gray-600">Preview</div>
          </div>
        </div>

        {/* Grid Context */}
        <div className="text-center text-xs text-gray-500 border-t pt-2">
          Red border shows the pixel you're hovering over
        </div>
      </div>
    </div>
  );
};

export default PixelZoomPreview;
