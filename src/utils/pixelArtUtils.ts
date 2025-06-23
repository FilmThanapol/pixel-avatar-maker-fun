
export const createEmptyGrid = (size: number): string[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(''));
};

export const saveToLocalStorage = (gridData: string[][], size: number) => {
  try {
    const saveData = {
      gridData,
      size,
      timestamp: Date.now()
    };
    localStorage.setItem('pixelArtGrid', JSON.stringify(saveData));
    console.log('Grid saved to localStorage');
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (defaultSize: number): { gridData: string[][]; size: number } => {
  try {
    const saved = localStorage.getItem('pixelArtGrid');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the loaded data
      if (parsed.gridData && Array.isArray(parsed.gridData) && 
          parsed.size && typeof parsed.size === 'number' &&
          parsed.gridData.length === parsed.size && 
          parsed.gridData.every((row: any) => Array.isArray(row) && row.length === parsed.size)) {
        console.log('Grid loaded from localStorage');
        return { gridData: parsed.gridData, size: parsed.size };
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return { gridData: createEmptyGrid(defaultSize), size: defaultSize };
};

export interface ExportOptions {
  includeGrid: boolean;
  scale: number;
  backgroundColor: string;
  filename: string;
}

export const exportToPNG = (
  gridData: string[][],
  size: number,
  options: Partial<ExportOptions> = {}
) => {
  const {
    includeGrid = false,
    scale = Math.max(20, 640 / size),
    backgroundColor = '#FFFFFF',
    filename = 'pixel-avatar'
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // Set canvas size with high quality scaling
  const finalScale = Math.max(scale, size >= 64 ? 8 : 16);
  canvas.width = size * finalScale;
  canvas.height = size * finalScale;

  // Disable image smoothing for crisp pixels
  ctx.imageSmoothingEnabled = false;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each pixel
  gridData.forEach((row, rowIndex) => {
    row.forEach((pixel, colIndex) => {
      if (pixel) {
        ctx.fillStyle = pixel;
        ctx.fillRect(
          colIndex * finalScale,
          rowIndex * finalScale,
          finalScale,
          finalScale
        );
      }
    });
  });

  // Draw grid lines if requested
  if (includeGrid) {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = Math.max(1, finalScale / 20);

    // Vertical lines
    for (let i = 0; i <= size; i++) {
      ctx.beginPath();
      ctx.moveTo(i * finalScale, 0);
      ctx.lineTo(i * finalScale, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= size; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * finalScale);
      ctx.lineTo(canvas.width, i * finalScale);
      ctx.stroke();
    }
  }

  // Create download link
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Image exported successfully');
    }
  }, 'image/png');
};
