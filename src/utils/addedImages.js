const STORAGE_KEY = "zabieno_added_images";

export function getAddedImages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addImage(imageData) {
  const added = getAddedImages();
  const newImage = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...imageData,
    addedAt: new Date().toISOString(),
  };
  added.push(newImage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(added));
  return newImage;
}

export function removeAddedImage(imageId) {
  const added = getAddedImages();
  const filtered = added.filter((img) => img.id !== imageId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getAddedImagesByCategory(category) {
  return getAddedImages().filter((img) => img.category === category);
}
