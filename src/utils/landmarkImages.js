// Landmark Thumbnail System — Completely disabled per user instruction
// Eliminates all external image downloads, dummy stock photos, and thumbnail banners.

export const THUMBNAILS_ENABLED = false;

export function getLandmarkThumbnail(_item) {
  return null;
}

export default {
  THUMBNAILS_ENABLED,
  getLandmarkThumbnail
};
