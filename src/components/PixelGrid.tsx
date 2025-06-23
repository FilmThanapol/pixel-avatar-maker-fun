
import React, { useState, useRef, useEffect } from 'react';

interface PixelGridProps {
  size: number;
  selectedColor: string;
  gridData: string[][];
  onPixelClick: (row: number, col: number) => void;
  onGridUpdate: (newGrid: string[][]) => void;
}

const PixelGrid: React.FC<PixelGridProps> = ({ 
  size, 
  selectedColor, 
  gridData, 
  onPixelClick,
  onGridUpdate 
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    onPixelClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      onPixelClick(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    setIsDrawing(true);
    onPixelClick(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.row && element.dataset.col) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      onPixelClick(row, col);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        ref={gridRef}
        className="inline-grid gap-0 border-2 border-gray-800 bg-white shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: 'min(320px, 80vw)',
          height: 'min(320px, 80vw)',
        }}
        onMouseUp={handleMouseUp}
        onTouchEnd={() => setIsDrawing(false)}
      >
        {gridData.map((row, rowIndex) =>
          row.map((pixel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-row={rowIndex}
              data-col={colIndex}
              className="border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity select-none"
              style={{
                backgroundColor: pixel || '#ffffff',
                aspectRatio: '1',
              }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
              onTouchMove={handleTouchMove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PixelGrid;
