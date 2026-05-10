/**
 * Model Integration Module
 * ==========================
 * This is the DROP-IN point for the trained model.
 * 
 * Currently runs in DEMO MODE (returns simulated results).
 * When the user provides the trained model (.pt → ONNX → TFJS):
 *   1. Place model files in /public/model/
 *   2. Set MODEL_READY = true below
 *   3. The entire app will instantly use real predictions
 * 
 * For HARDWARE INTEGRATION:
 *   The analyzeImage() function is the single entry point.
 *   Any hardware system can call the /api/analyze endpoint
 *   which delegates to this module.
 */

import { CLASS_NAMES, CLASS_LABELS, HEALTHY_CLASSES, DISEASE_INFO, SPRAY_CONFIG } from './constants';

// ═══════════════════════════════════════════════════════
// ▼▼▼  CHANGE THIS TO true WHEN MODEL IS READY  ▼▼▼
export const MODEL_READY = true;
// ═══════════════════════════════════════════════════════

let cachedSession = null;

/**
 * Load the ONNX model from /model/model.onnx
 */
async function loadRealModel() {
  if (cachedSession) return cachedSession;
  
  const ort = await import('onnxruntime-web');
  
  // Set WASM paths to CDN to avoid missing file errors in Next.js public directory
  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/';
  
  // Load the model
  cachedSession = await ort.InferenceSession.create('/model/model.onnx', { executionProviders: ['wasm'] });
  return cachedSession;
}

function preprocessImage(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, 224, 224);
  const imageData = ctx.getImageData(0, 0, 224, 224).data;
  
  const float32Data = new Float32Array(3 * 224 * 224);
  // PyTorch/YOLO expects NCHW format [1, 3, 224, 224] and scaled to 0-1
  for (let i = 0; i < 224 * 224; i++) {
    float32Data[i] = imageData[i * 4] / 255.0; // R
    float32Data[224 * 224 + i] = imageData[i * 4 + 1] / 255.0; // G
    float32Data[2 * 224 * 224 + i] = imageData[i * 4 + 2] / 255.0; // B
  }
  return float32Data;
}

/**
 * Run real inference on an image using the ONNX model.
 */
async function runRealInference(imageElement) {
  const session = await loadRealModel();
  const ort = await import('onnxruntime-web');
  
  const tensorData = preprocessImage(imageElement);
  const tensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);
  
  const feeds = {};
  feeds[session.inputNames[0]] = tensor;
  
  const results = await session.run(feeds);
  const output = results[session.outputNames[0]];
  const probabilities = output.data;
  
  // Apply softmax because YOLO classification raw outputs are logits
  const maxLogit = Math.max(...probabilities);
  const exps = Array.from(probabilities).map(x => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  const softmaxProbs = exps.map(x => x / sumExps);
  
  // Find top 3 predictions
  const indexed = Array.from(softmaxProbs).map((prob, idx) => ({ idx, prob }));
  indexed.sort((a, b) => b.prob - a.prob);
  const top3 = indexed.slice(0, 3);
  
  return top3.map(({ idx, prob }) => ({
    className: CLASS_NAMES[idx] || `Unknown_${idx}`,
    label: CLASS_LABELS[CLASS_NAMES[idx]] || 'Unknown',
    confidence: prob,
    isHealthy: HEALTHY_CLASSES.has(CLASS_NAMES[idx]),
    diseaseInfo: DISEASE_INFO[CLASS_NAMES[idx]] || null,
  }));
}

/**
 * Generate demo results for testing the UI without a real model.
 * Returns realistic-looking predictions so all UI states can be tested.
 */
function runDemoInference() {
  // Randomly pick a result type to demonstrate all UI states
  const demoScenarios = [
    // Healthy plant
    {
      predictions: [
        { className: 'Apple___healthy', label: 'Apple (Healthy)', confidence: 0.94, isHealthy: true, diseaseInfo: null },
        { className: 'Cherry_(including_sour)___healthy', label: 'Cherry (Healthy)', confidence: 0.03, isHealthy: true, diseaseInfo: null },
        { className: 'Grape___healthy', label: 'Grape (Healthy)', confidence: 0.02, isHealthy: true, diseaseInfo: null },
      ],
    },
    // Disease detected
    {
      predictions: [
        { className: 'Apple___Apple_scab', label: 'Apple Scab', confidence: 0.91, isHealthy: false, diseaseInfo: DISEASE_INFO['Apple___Apple_scab'] },
        { className: 'Apple___Cedar_apple_rust', label: 'Cedar Apple Rust', confidence: 0.05, isHealthy: false, diseaseInfo: DISEASE_INFO['Apple___Cedar_apple_rust'] },
        { className: 'Apple___healthy', label: 'Apple (Healthy)', confidence: 0.03, isHealthy: true, diseaseInfo: null },
      ],
    },
    // Critical disease
    {
      predictions: [
        { className: 'Tomato___Late_blight', label: 'Late Blight', confidence: 0.96, isHealthy: false, diseaseInfo: DISEASE_INFO['Tomato___Late_blight'] },
        { className: 'Tomato___Early_blight', label: 'Early Blight', confidence: 0.02, isHealthy: false, diseaseInfo: DISEASE_INFO['Tomato___Early_blight'] },
        { className: 'Tomato___healthy', label: 'Tomato (Healthy)', confidence: 0.01, isHealthy: true, diseaseInfo: null },
      ],
    },
    // Moderate disease
    {
      predictions: [
        { className: 'Grape___Black_rot', label: 'Black Rot', confidence: 0.88, isHealthy: false, diseaseInfo: DISEASE_INFO['Grape___Black_rot'] },
        { className: 'Grape___Esca_(Black_Measles)', label: 'Esca (Black Measles)', confidence: 0.07, isHealthy: false, diseaseInfo: DISEASE_INFO['Grape___Esca_(Black_Measles)'] },
        { className: 'Grape___healthy', label: 'Grape (Healthy)', confidence: 0.04, isHealthy: true, diseaseInfo: null },
      ],
    },
  ];
  
  const scenario = demoScenarios[Math.floor(Math.random() * demoScenarios.length)];
  return scenario.predictions;
}

/**
 * MAIN ENTRY POINT — Analyze an image for plant diseases.
 * 
 * This is the ONLY function the app and hardware API call.
 * 
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|null} imageElement
 *   - Pass an image/video/canvas element for browser-based analysis
 *   - Pass null to run in demo mode
 * @returns {Object} Analysis result with predictions, spray decision, etc.
 */
export async function analyzeImage(imageElement) {
  let predictions;
  
  if (MODEL_READY && imageElement) {
    predictions = await runRealInference(imageElement);
  } else {
    // Demo mode — simulate a brief delay like real inference
    await new Promise(r => setTimeout(r, 800));
    predictions = runDemoInference();
  }
  
  const topPrediction = predictions[0];
  const isHealthy = topPrediction.isHealthy;
  const confidence = topPrediction.confidence;
  const isNotPlant = confidence < SPRAY_CONFIG.outOfDistributionThreshold;
  const meetsSprayThreshold = !isHealthy && confidence >= SPRAY_CONFIG.sprayConfidenceThreshold;
  
  // Determine traffic light color
  let light = 'green';  // Default: healthy, no spray
  if (isNotPlant) {
    light = 'amber'; // Needs user attention to re-capture
  } else if (!isHealthy && meetsSprayThreshold) {
    light = 'red';       // Disease confirmed → spray recommended
  } else if (!isHealthy && confidence >= SPRAY_CONFIG.confidenceThreshold) {
    light = 'amber';     // Possible disease → investigate further
  }
  
  return {
    predictions,
    topPrediction,
    isHealthy,
    isNotPlant,
    confidence,
    light,           // 'green' | 'amber' | 'red'
    shouldSpray: light === 'red',
    isDemo: !MODEL_READY,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Release the ONNX session.
 */
export async function disposeModel() {
  if (cachedSession) {
    await cachedSession.release();
    cachedSession = null;
  }
}
