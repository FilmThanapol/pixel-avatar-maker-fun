// Image to Pixel Art Converter Utility
export interface PixelArtOptions {
  gridSize: number;
  colorCount?: number;
  maintainAspectRatio?: boolean;
  cropToFit?: boolean;
}

export interface ColorPalette {
  r: number;
  g: number;
  b: number;
  count: number;
}

// Fetch random image from Lorem Picsum
export const fetchRandomImage = async (size: number = 300): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for canvas manipulation
    
    // Add random parameter to avoid caching and get different images
    const randomId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/${size}?random=${randomId}`;
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from Lorem Picsum'));
    
    img.src = imageUrl;
  });
};

// Enhanced color quantization with better pixel art aesthetics
export const quantizeColors = (imageData: ImageData, colorCount: number = 16): ColorPalette[] => {
  const pixels: ColorPalette[] = [];
  const data = imageData.data;

  // Extract all colors with slight color reduction for better grouping
  for (let i = 0; i < data.length; i += 4) {
    // Reduce color precision to group similar colors
    const r = Math.round(data[i] / 8) * 8;
    const g = Math.round(data[i + 1] / 8) * 8;
    const b = Math.round(data[i + 2] / 8) * 8;

    // Skip transparent pixels
    if (data[i + 3] < 128) continue;

    const existingColor = pixels.find(p => p.r === r && p.g === g && p.b === b);
    if (existingColor) {
      existingColor.count++;
    } else {
      pixels.push({ r, g, b, count: 1 });
    }
  }

  // If we have fewer colors than requested, return all
  if (pixels.length <= colorCount) {
    return pixels;
  }

  // Sort by frequency and luminance for better selection
  pixels.sort((a, b) => {
    const aLuminance = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const bLuminance = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;

    // Primary sort by count, secondary by luminance for variety
    if (Math.abs(a.count - b.count) > pixels.length * 0.1) {
      return b.count - a.count;
    }
    return Math.abs(aLuminance - 128) - Math.abs(bLuminance - 128);
  });

  // Use improved k-means clustering
  const palette: ColorPalette[] = [];
  const usedColors = new Set<string>();

  // Always include the most common color
  if (pixels.length > 0) {
    palette.push(pixels[0]);
    usedColors.add(`${pixels[0].r},${pixels[0].g},${pixels[0].b}`);
  }

  // Select diverse colors using distance-based selection
  for (let i = 1; i < pixels.length && palette.length < colorCount; i++) {
    const candidate = pixels[i];
    const colorKey = `${candidate.r},${candidate.g},${candidate.b}`;

    if (usedColors.has(colorKey)) continue;

    // Check if this color is sufficiently different from existing palette
    let minDistance = Infinity;
    for (const existing of palette) {
      const distance = Math.sqrt(
        Math.pow(candidate.r - existing.r, 2) +
        Math.pow(candidate.g - existing.g, 2) +
        Math.pow(candidate.b - existing.b, 2)
      );
      minDistance = Math.min(minDistance, distance);
    }

    // Only add if sufficiently different (minimum distance threshold)
    const threshold = palette.length < colorCount / 2 ? 30 : 20;
    if (minDistance > threshold || palette.length < 4) {
      palette.push(candidate);
      usedColors.add(colorKey);
    }
  }

  // Fill remaining slots with most frequent remaining colors if needed
  for (let i = 0; i < pixels.length && palette.length < colorCount; i++) {
    const candidate = pixels[i];
    const colorKey = `${candidate.r},${candidate.g},${candidate.b}`;

    if (!usedColors.has(colorKey)) {
      palette.push(candidate);
      usedColors.add(colorKey);
    }
  }

  return palette;
};

// Find closest color in palette
const findClosestColor = (r: number, g: number, b: number, palette: ColorPalette[]): ColorPalette => {
  let minDistance = Infinity;
  let closestColor = palette[0];
  
  for (const color of palette) {
    const distance = Math.sqrt(
      Math.pow(r - color.r, 2) +
      Math.pow(g - color.g, 2) +
      Math.pow(b - color.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }
  
  return closestColor;
};

// Convert image to pixel art grid
export const convertImageToPixelArt = async (
  image: HTMLImageElement,
  options: PixelArtOptions
): Promise<string[][]> => {
  const { gridSize, colorCount = 16, maintainAspectRatio = true, cropToFit = true } = options;
  
  // Create offscreen canvas for image processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Calculate dimensions with improved aspect ratio handling
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;
  let destX = 0;
  let destY = 0;
  let destWidth = gridSize;
  let destHeight = gridSize;

  if (maintainAspectRatio) {
    const aspectRatio = image.width / image.height;

    if (cropToFit) {
      // Smart center crop - crop to square using the most interesting part
      if (aspectRatio > 1) {
        // Landscape: crop width, prefer center-left for better composition
        sourceWidth = image.height;
        sourceX = Math.max(0, (image.width - sourceWidth) * 0.4); // Slightly off-center
      } else if (aspectRatio < 1) {
        // Portrait: crop height, prefer upper portion
        sourceHeight = image.width;
        sourceY = Math.max(0, (image.height - sourceHeight) * 0.3); // Upper third
      }
      // Square images need no cropping
    } else {
      // Letterbox: fit entire image with padding
      if (aspectRatio > 1) {
        // Landscape: fit width, center vertically
        destHeight = Math.round(gridSize / aspectRatio);
        destY = Math.round((gridSize - destHeight) / 2);
      } else if (aspectRatio < 1) {
        // Portrait: fit height, center horizontally
        destWidth = Math.round(gridSize * aspectRatio);
        destX = Math.round((gridSize - destWidth) / 2);
      }
      // Square images fit perfectly
    }
  }
  
  // Set canvas size to grid size
  canvas.width = gridSize;
  canvas.height = gridSize;

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, gridSize, gridSize);

  // Draw and resize image with improved scaling
  ctx.imageSmoothingEnabled = false; // Pixelated scaling for pixel art effect
  ctx.drawImage(
    image,
    sourceX, sourceY, sourceWidth, sourceHeight,
    destX, destY, destWidth, destHeight
  );
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, gridSize, gridSize);
  
  // Quantize colors
  const palette = quantizeColors(imageData, colorCount);
  
  // Convert to pixel grid
  const pixelGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const data = imageData.data;
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const index = (y * gridSize + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      
      if (a > 128) { // Only process non-transparent pixels
        const closestColor = findClosestColor(r, g, b, palette);
        const hexColor = `#${closestColor.r.toString(16).padStart(2, '0')}${closestColor.g.toString(16).padStart(2, '0')}${closestColor.b.toString(16).padStart(2, '0')}`;
        pixelGrid[y][x] = hexColor;
      }
    }
  }
  
  return pixelGrid;
};

// Main function to generate pixel art from random image
export const generatePixelArtFromRandomImage = async (
  gridSize: number,
  options: Partial<PixelArtOptions> = {}
): Promise<string[][]> => {
  try {
    // Fetch random image
    const image = await fetchRandomImage(300);
    
    // Convert to pixel art
    const pixelArt = await convertImageToPixelArt(image, {
      gridSize,
      colorCount: 16,
      maintainAspectRatio: true,
      cropToFit: true,
      ...options
    });
    
    return pixelArt;
  } catch (error) {
    console.error('Failed to generate pixel art from random image:', error);
    throw error;
  }
};
