/**
 * Model Integration Module — Cloud Gemini Engine
 * ===============================================
 * This module connects the frontend UI directly to the Gemini Vision API
 * via the local /api/analyze route. 
 * This gives infinite range and superior reasoning capability.
 */

// We keep MODEL_READY true to indicate the AI is fully armed.
export const MODEL_READY = true;

/**
 * Helper to convert an image element (img, canvas, video) into a base64 JPEG string.
 */
function getBase64FromImage(imageElement) {
  // If it's a data URL string, return it
  if (typeof imageElement === 'string' && imageElement.startsWith('data:image')) {
    return imageElement;
  }

  // If it's an img element and already a data URL, just return it
  if (imageElement instanceof HTMLImageElement && imageElement.src.startsWith('data:image')) {
    return imageElement.src;
  }

  const canvas = document.createElement('canvas');
  // Use a reasonable resolution for the API to save bandwidth but keep detail
  canvas.width = imageElement.naturalWidth || imageElement.videoWidth || imageElement.width || 800;
  canvas.height = imageElement.naturalHeight || imageElement.videoHeight || imageElement.height || 800;
  
  // Cap max dimension to 1024 to speed up API transfer
  const maxDim = 1024;
  if (canvas.width > maxDim || canvas.height > maxDim) {
    const ratio = Math.min(maxDim / canvas.width, maxDim / canvas.height);
    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height * ratio;
  }

  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.85); // 85% quality JPEG
}

/**
 * MAIN ENTRY POINT — Analyze an image for plant diseases using Gemini API.
 * 
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|null} imageElement
 * @returns {Object} Analysis result from the Gemini model
 */
export async function analyzeImage(imageElement) {
  if (!imageElement) {
    throw new Error('No image provided to analyze.');
  }

  try {
    const base64Image = getBase64FromImage(imageElement);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to process image with Deep Scan AI.');
    }

    // The API route returns the correctly formatted object
    return data.result;

  } catch (error) {
    console.error('Inference Error:', error);
    return { error: error.message };
  }
}

/**
 * Cleanup (no longer needed for Cloud API, but kept for interface compatibility)
 */
export async function disposeModel() {
  // No local session to release
}
