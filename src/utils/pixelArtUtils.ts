
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

export const exportToPNG = (gridData: string[][], size: number, filename: string = 'pixel-avatar') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // Set canvas size (multiply by scale factor for better quality)
  const scale = Math.max(20, 640 / size); // Adaptive scale based on grid size
  canvas.width = size * scale;
  canvas.height = size * scale;

  // Disable image smoothing for crisp pixels
  ctx.imageSmoothingEnabled = false;

  // Fill background with white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each pixel
  gridData.forEach((row, rowIndex) => {
    row.forEach((pixel, colIndex) => {
      if (pixel) {
        ctx.fillStyle = pixel;
        ctx.fillRect(
          colIndex * scale,
          rowIndex * scale,
          scale,
          scale
        );
      }
    });
  });

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
