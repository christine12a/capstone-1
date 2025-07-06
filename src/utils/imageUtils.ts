/**
 * Get a fallback image URL for when room images fail to load
 */
export const getRoomImageFallback = (roomType: string = 'standard'): string => {
  const fallbacks: Record<string, string> = {
    standard: 'https://via.placeholder.com/400x300?text=Standard+Room',
    deluxe: 'https://via.placeholder.com/400x300?text=Deluxe+Room',
    suite: 'https://via.placeholder.com/400x300?text=Suite+Room',
    family: 'https://via.placeholder.com/400x300?text=Family+Room'
  };
  
  return fallbacks[roomType] || 'https://via.placeholder.com/400x300?text=Hotel+Room';
};

/**
 * Handle image error event by setting a fallback image
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, roomType: string = 'standard'): void => {
  const target = e.target as HTMLImageElement;
  target.onerror = null; // Prevent infinite error loop
  target.src = getRoomImageFallback(roomType);
};
