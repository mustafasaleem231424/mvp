/**
 * PreciFarm Image Processor Worker
 * Handles intensive image resizing and compression off-main-thread.
 */
self.onmessage = async (e) => {
  const { imageBitmap, maxWidth, maxHeight, quality } = e.data;
  
  const canvas = new OffscreenCanvas(maxWidth, maxHeight);
  const ctx = canvas.getContext('2d');
  
  // Calculate aspect ratio
  let width = imageBitmap.width;
  let height = imageBitmap.height;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = width * ratio;
    height = height * ratio;
  }
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  const reader = new FileReader();
  
  reader.onloadend = () => {
    self.postMessage({ base64: reader.result });
  };
  
  reader.readAsDataURL(blob);
};
