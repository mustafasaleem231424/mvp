/**
 * constants.js
 * =============
 * Global configuration for the PreciFarm Expert AI Engine.
 * All botanical intelligence is now provided dynamically by the Cloud AI.
 */

export const SPRAY_CONFIG = {
  confidenceThreshold: 0.60,    // General confidence threshold
  sprayConfidenceThreshold: 0.70, // Confidence required for a "SPRAY" recommendation
};

export const APP_CONFIG = {
  name: 'PreciFarm AI',
  tagline: 'Expert Plant Pathology & Diagnostic Intelligence',
  version: '2.5.0',
};

// Colors for the Traffic Light System
export const STATUS_COLORS = {
  green: '#21A049', // Healthy
  amber: '#F59E0B', // Monitor/Warning
  red: '#EF4444',   // Action Required (Spray)
};
