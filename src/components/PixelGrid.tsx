
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixelGridProps {
  size: number;
  selectedColor: string;
  gridData: string[][];
  onPixelClick: (row: number, col: number) => void;
  onGridUpdate: (newGrid: string[][]) => void;
  onPixelHover?: (row: number, col: number) => void;
  onPixelLeave?: () => void;
}

const PixelGrid: React.FC<PixelGridProps> = ({
  size,
  selectedColor,
  gridData,
  onPixelClick,
  onGridUpdate,
  onPixelHover,
  onPixelLeave
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate optimal initial zoom and canvas size based on grid size
  const getOptimalSize = useCallback(() => {
    const maxSize = Math.min(window.innerWidth * 0.6, window.innerHeight * 0.6, 600);
    const basePixelSize = Math.max(2, Math.floor(maxSize / size));
    const canvasSize = size * basePixelSize;
    return { basePixelSize, canvasSize };
  }, [size]);

  const { basePixelSize, canvasSize } = getOptimalSize();

  // Reset zoom and pan when grid size changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [size]);

  const handleMouseDown = (e: React.MouseEvent, row?: number, col?: number) => {
    if (e.button === 1 || e.ctrlKey) { // Middle mouse or Ctrl+click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    } else if (row !== undefined && col !== undefined) {
      setIsDrawing(true);
      onPixelClick(row, col);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      onPixelClick(row, col);
    }
    onPixelHover?.(row, col);
  };

  const handleMouseLeave = () => {
    onPixelLeave?.();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(5, prev * 1.2));
  const zoomOut = () => setZoom(prev => Math.max(0.5, prev / 1.2));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false);
      setIsPanning(false);
    };
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
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    if (element && element.dataset && element.dataset.row && element.dataset.col) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      onPixelClick(row, col);
    }
  };

  const pixelSize = basePixelSize * zoom;
  const gridStyle = {
    gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
    gridTemplateRows: `repeat(${size}, ${pixelSize}px)`,
    transform: `translate(${pan.x}px, ${pan.y}px)`,
    cursor: isPanning ? 'grabbing' : 'default'
  };

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex justify-center gap-2">
        <Button size="sm" variant="outline" onClick={zoomOut} disabled={zoom <= 0.5}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button size="sm" variant="outline" onClick={zoomIn} disabled={zoom >= 5}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={resetView}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid Container */}
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="relative overflow-hidden border-2 border-gray-800 bg-gray-100 shadow-lg"
          style={{
            width: Math.min(canvasSize, window.innerWidth * 0.8),
            height: Math.min(canvasSize, window.innerHeight * 0.6),
            maxWidth: '600px',
            maxHeight: '600px'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={gridRef}
            className="inline-grid gap-0 bg-white absolute"
            style={gridStyle}
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
                    width: `${pixelSize}px`,
                    height: `${pixelSize}px`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchMove={handleTouchMove}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {size >= 64 && (
        <div className="text-center text-sm text-gray-600">
          💡 Use Ctrl+Scroll to zoom, Ctrl+Click to pan, or use the zoom controls above
        </div>
      )}
    </div>
  );
};

export default PixelGrid;
