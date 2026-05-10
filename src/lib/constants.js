/**
 * constants.js
 * =============
 * Central config — disease info, class maps, colors, and thresholds.
 * When the user provides model results, update CLASS_NAMES to match.
 */

// ─── Plant Disease Classes ──────────────────────────────
// Full PlantVillage 38-class set. The model outputs a class index
// that maps to one of these names.
export const CLASS_NAMES = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy',
];

// Human-friendly labels
export const CLASS_LABELS = {};
CLASS_NAMES.forEach((name) => {
  // "Apple___Apple_scab" → "Apple Scab"
  const parts = name.split('___');
  const crop = parts[0].replace(/_/g, ' ').replace(/,/g, ',');
  let disease = parts[1] || '';
  disease = disease.replace(/_/g, ' ').trim();
  CLASS_LABELS[name] = disease === 'healthy' ? `${crop} (Healthy)` : disease;
});

// Which classes are healthy (no spray needed)
export const HEALTHY_CLASSES = new Set(
  CLASS_NAMES.filter((n) => n.includes('healthy'))
);

// ─── Disease Info for Treatment Advice ──────────────────
export const DISEASE_INFO = {
  'Apple___Apple_scab': {
    crop: 'Apple', disease: 'Apple Scab', severity: 'High',
    advice: 'Apply captan or myclobutanil fungicide. Remove fallen leaves. Prune for air circulation.',
  },
  'Apple___Black_rot': {
    crop: 'Apple', disease: 'Black Rot', severity: 'Critical',
    advice: 'Remove mummified fruit immediately. Apply fungicide. Prune dead wood from the tree.',
  },
  'Apple___Cedar_apple_rust': {
    crop: 'Apple', disease: 'Cedar Apple Rust', severity: 'Moderate',
    advice: 'Apply fungicide in spring. Remove nearby juniper/cedar trees if possible.',
  },
  'Cherry_(including_sour)___Powdery_mildew': {
    crop: 'Cherry', disease: 'Powdery Mildew', severity: 'Moderate',
    advice: 'Apply sulfur-based fungicide. Improve air circulation. Avoid overhead watering.',
  },
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    crop: 'Corn', disease: 'Gray Leaf Spot', severity: 'High',
    advice: 'Apply strobilurin fungicide. Rotate crops. Use resistant varieties next season.',
  },
  'Corn_(maize)___Common_rust_': {
    crop: 'Corn', disease: 'Common Rust', severity: 'Moderate',
    advice: 'Apply fungicide if severe. Plant resistant hybrids. Monitor closely.',
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    crop: 'Corn', disease: 'Northern Leaf Blight', severity: 'High',
    advice: 'Apply foliar fungicide. Rotate crops yearly. Plow under debris.',
  },
  'Grape___Black_rot': {
    crop: 'Grape', disease: 'Black Rot', severity: 'Critical',
    advice: 'Remove infected berries and leaves. Apply mancozeb or myclobutanil before bloom.',
  },
  'Grape___Esca_(Black_Measles)': {
    crop: 'Grape', disease: 'Esca (Black Measles)', severity: 'Critical',
    advice: 'No cure. Remove severely affected vines. Minimize pruning wounds.',
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    crop: 'Grape', disease: 'Leaf Blight', severity: 'Moderate',
    advice: 'Apply copper-based fungicide. Remove infected leaves. Ensure good drainage.',
  },
  'Orange___Haunglongbing_(Citrus_greening)': {
    crop: 'Orange', disease: 'Citrus Greening (HLB)', severity: 'Critical',
    advice: 'No cure — remove infected trees to prevent spread. Control psyllid insects.',
  },
  'Peach___Bacterial_spot': {
    crop: 'Peach', disease: 'Bacterial Spot', severity: 'High',
    advice: 'Apply copper sprays. Avoid overhead irrigation. Plant resistant varieties.',
  },
  'Pepper,_bell___Bacterial_spot': {
    crop: 'Bell Pepper', disease: 'Bacterial Spot', severity: 'High',
    advice: 'Apply copper-based bactericide. Remove infected plants. Use disease-free seeds.',
  },
  'Potato___Early_blight': {
    crop: 'Potato', disease: 'Early Blight', severity: 'High',
    advice: 'Apply chlorothalonil fungicide. Remove lower infected leaves. Rotate crops.',
  },
  'Potato___Late_blight': {
    crop: 'Potato', disease: 'Late Blight', severity: 'Critical',
    advice: 'Apply fungicide immediately. Destroy infected plants. This spreads very fast!',
  },
  'Squash___Powdery_mildew': {
    crop: 'Squash', disease: 'Powdery Mildew', severity: 'Moderate',
    advice: 'Apply sulfur or potassium bicarbonate. Improve spacing for airflow.',
  },
  'Strawberry___Leaf_scorch': {
    crop: 'Strawberry', disease: 'Leaf Scorch', severity: 'Moderate',
    advice: 'Remove infected leaves. Apply fungicide. Avoid overhead watering.',
  },
  'Tomato___Bacterial_spot': {
    crop: 'Tomato', disease: 'Bacterial Spot', severity: 'High',
    advice: 'Apply copper spray. Remove infected leaves. Avoid working with wet plants.',
  },
  'Tomato___Early_blight': {
    crop: 'Tomato', disease: 'Early Blight', severity: 'High',
    advice: 'Apply chlorothalonil or copper fungicide. Mulch around base. Remove lower leaves.',
  },
  'Tomato___Late_blight': {
    crop: 'Tomato', disease: 'Late Blight', severity: 'Critical',
    advice: 'Apply fungicide immediately! Remove and destroy infected plants. Highly contagious.',
  },
  'Tomato___Leaf_Mold': {
    crop: 'Tomato', disease: 'Leaf Mold', severity: 'Moderate',
    advice: 'Improve ventilation. Reduce humidity. Apply chlorothalonil if severe.',
  },
  'Tomato___Septoria_leaf_spot': {
    crop: 'Tomato', disease: 'Septoria Leaf Spot', severity: 'High',
    advice: 'Apply fungicide. Remove infected lower leaves. Avoid splashing water on leaves.',
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    crop: 'Tomato', disease: 'Spider Mites', severity: 'Moderate',
    advice: 'Spray with insecticidal soap or neem oil. Increase humidity. Introduce predatory mites.',
  },
  'Tomato___Target_Spot': {
    crop: 'Tomato', disease: 'Target Spot', severity: 'High',
    advice: 'Apply chlorothalonil fungicide. Remove infected leaves. Space plants wider.',
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    crop: 'Tomato', disease: 'Yellow Leaf Curl Virus', severity: 'Critical',
    advice: 'No cure — remove infected plants. Control whiteflies with insecticide or sticky traps.',
  },
  'Tomato___Tomato_mosaic_virus': {
    crop: 'Tomato', disease: 'Mosaic Virus', severity: 'High',
    advice: 'No cure — remove infected plants. Disinfect tools. Use resistant varieties.',
  },
};

// Fill in default info for classes not listed above
CLASS_NAMES.forEach((name) => {
  if (!DISEASE_INFO[name] && !HEALTHY_CLASSES.has(name)) {
    const parts = name.split('___');
    DISEASE_INFO[name] = {
      crop: parts[0].replace(/_/g, ' '),
      disease: parts[1]?.replace(/_/g, ' ') || 'Unknown',
      severity: 'Moderate',
      advice: 'Consult your local agricultural extension office for treatment options.',
    };
  }
});

// ─── Spray Decision Config ──────────────────────────────
export const SPRAY_CONFIG = {
  confidenceThreshold: 0.60,    // Minimum confidence to trust a prediction
  sprayConfidenceThreshold: 0.70, // Higher bar before recommending spray
  outOfDistributionThreshold: 0.45, // If confidence is below this, it's likely not a plant leaf
};

// ─── App Metadata ───────────────────────────────────────
export const APP_CONFIG = {
  name: 'CropGuard AI',
  tagline: 'Scan your crops. Detect diseases. Protect your harvest.',
  version: '1.0.0',
};
