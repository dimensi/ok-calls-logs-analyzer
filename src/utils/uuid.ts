/**
 * Generate UUID v4 using crypto API
 * Optimized for performance with large datasets
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Batch generate UUIDs for better performance
 * @param count Number of UUIDs to generate
 * @returns Array of UUIDs
 */
export function generateUUIDs(count: number): string[] {
  const uuids: string[] = new Array(count);

  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // Use native crypto.randomUUID for better performance
    for (let i = 0; i < count; i++) {
      uuids[i] = crypto.randomUUID();
    }
  } else {
    // Fallback implementation
    for (let i = 0; i < count; i++) {
      uuids[i] = generateUUID();
    }
  }

  return uuids;
}
