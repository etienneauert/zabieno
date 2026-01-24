const STORAGE_KEY = "zabieno_deleted_images";

export function getDeletedImages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function deleteImage(imagePath) {
  const deleted = getDeletedImages();
  if (!deleted.includes(imagePath)) {
    deleted.push(imagePath);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deleted));
  }
}

export function isImageDeleted(imagePath) {
  return getDeletedImages().includes(imagePath);
}
